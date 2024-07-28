import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { API_BASE_URL, API_ROUTES } from '../contants/api.constants';
import {
  AuthenticationRequest,
  ApiResponse,
  AuthenticationResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from '../contracts';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = `${API_BASE_URL}`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  authenticate(
    request: AuthenticationRequest
  ): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http
      .post<ApiResponse<AuthenticationResponse>>(
        `${this.baseUrl}${API_ROUTES.AUTHENTICATE}`,
        request,
        this.httpOptions
      )
      .pipe(
        switchMap((response) => {
          if (response.succeeded) {
            // Store tokens if authentication is successful
            this.tokenService.setAccessToken(response.data!.jwToken);
            this.tokenService.setRefreshToken(response.data!.refreshToken);
          }
          return of(response);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  register(request: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${this.baseUrl}${API_ROUTES.REGISTER}`,
        request,
        this.httpOptions
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  confirmEmail(userId: string, code: string): Observable<ApiResponse<string>> {
    return this.http
      .get<ApiResponse<string>>(`${this.baseUrl}${API_ROUTES.CONFIRM_EMAIL}`, {
        params: {
          userId,
          code,
        },
        headers: this.httpOptions.headers,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(
        `${this.baseUrl}${API_ROUTES.FORGOT_PASSWORD}`,
        request,
        this.httpOptions
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(
        `${this.baseUrl}${API_ROUTES.RESET_PASSWORD}`,
        request,
        this.httpOptions
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  logout(): Observable<ApiResponse<string>> {
    // Optionally, handle server-side logout (invalidate tokens)
    return this.http
      .post<ApiResponse<string>>(
        `${this.baseUrl}${API_ROUTES.LOGOUT}`,
        {},
        this.httpOptions
      )
      .pipe(
        switchMap((response) => {
          // Regardless of server-side response, clear local tokens
          this.tokenService.removeAccessToken();
          this.tokenService.removeRefreshToken();
          return of(response);
        }),
        catchError((error) => {
          // Clear tokens even if server-side logout fails
          this.tokenService.removeAccessToken();
          this.tokenService.removeRefreshToken();
          return this.handleError(error);
        })
      );
  }

  refreshToken(token: string): Observable<ApiResponse<AuthenticationResponse>> {
    const requestPayload: RefreshTokenRequest = { token };
    return this.http
      .post<ApiResponse<AuthenticationResponse>>(
        `${this.baseUrl}${API_ROUTES.REFRESH_TOKEN}`,
        requestPayload,
        this.httpOptions
      )
      .pipe(
        switchMap((response) => {
          if (response.succeeded) {
            // Store new tokens if refresh is successful
            this.tokenService.setAccessToken(response.data!.jwToken);
            this.tokenService.setRefreshToken(response.data!.refreshToken);
          } else {
            return throwError(() => new Error(response.message));
          }
          return of(response);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  getUserRoles(userId: string): Observable<ApiResponse<string[]>> {
    return this.http
      .get<ApiResponse<string[]>>(
        `${this.baseUrl}${API_ROUTES.ROLES}/${userId}`,
        this.httpOptions
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserPermissions(userId: string): Observable<ApiResponse<string[]>> {
    return this.http
      .get<ApiResponse<string[]>>(
        `${this.baseUrl}${API_ROUTES.PERMISSIONS}/${userId}`,
        this.httpOptions
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    // You can handle specific error types here if needed
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
