import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private accountService: AccountService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add authorization header to the request if access token is available
    const authReq = this.addAuthHeader(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          return this.handleUnauthorizedError(req, next);
        } else {
          // For other HTTP errors, rethrow them
          return throwError(() => new Error(`HTTP Error: ${error.message}`));
        }
      })
    );
  }

  /**
   * Adds the Authorization header to the request if the access token is present.
   */
  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokenService.getAccessToken();
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return req;
  }

  /**
   * Handles a 401 Unauthorized error by attempting to refresh the access token.
   */
  private handleUnauthorizedError(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.refreshToken().pipe(
      switchMap(() => {
        // Retry the original request with the new access token
        const newToken = this.tokenService.getAccessToken();
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken || ''}`,
          },
        });
        return next.handle(retryReq);
      }),
      catchError(() => {
        // Handle cases where refresh token is also expired or invalid
        this.handleAuthError();
        return throwError(
          () => new Error('Token refresh failed. Redirecting to login.')
        );
      })
    );
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  private refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.accountService.refreshToken(refreshToken).pipe(
      tap((response) => {
        if (response.succeeded) {
          // Store new tokens
          this.tokenService.setAccessToken(response.data!.jwToken);
          this.tokenService.setRefreshToken(response.data!.refreshToken);
        } else {
          // Handle error if refresh token is invalid
          throwError(() => new Error(response.message));
        }
      }),
      catchError((error) => {
        // If the refresh token is expired or invalid, handle the error
        if (error.status === 403 || error.status === 401) {
          this.handleAuthError();
        }
        return throwError(() => new Error('Refresh token expired or invalid.'));
      })
    );
  }

  /**
   * Clears tokens and redirects the user to the login page.
   */
  private handleAuthError(): void {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    this.router.navigate(['/login']);
  }
}
