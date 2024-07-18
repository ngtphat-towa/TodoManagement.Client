import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ROUTES } from '../contants/api.constants';
import {
  AuthenticationRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../contracts/auth/auth.request';
import { AuthenticationResponse } from '../contracts/auth/auth.response';
import { ApiResponse } from '../contracts/wrapper/response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = `${API_BASE_URL}`;

  constructor(private http: HttpClient) {}

  authenticate(
    request: AuthenticationRequest
  ): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(
      `${this.baseUrl}${API_ROUTES.AUTHENTICATE}`,
      request
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}${API_ROUTES.REGISTER}`,
      request
    );
  }

  confirmEmail(userId: string, code: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(
      `${this.baseUrl}${API_ROUTES.CONFIRM_EMAIL}`,
      {
        params: {
          userId,
          code,
        },
      }
    );
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ROUTES.FORGOT_PASSWORD}`,
      request
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}${API_ROUTES.RESET_PASSWORD}`,
      request
    );
  }
}
