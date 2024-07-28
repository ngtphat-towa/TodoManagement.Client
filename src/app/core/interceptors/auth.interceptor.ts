import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AccountService } from '../services/account.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accountService = inject(AccountService);
  const router = inject(Router);

  const authReq = addAuthHeader(req, tokenService);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleUnauthorizedError(
          req,
          next,
          tokenService,
          accountService,
          router
        );
      } else {
        return throwError(() => new Error(`HTTP Error: ${error.message}`));
      }
    })
  );
};

function addAuthHeader(
  req: HttpRequest<any>,
  tokenService: TokenService
): HttpRequest<any> {
  const token = tokenService.getAccessToken();
  if (token) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return req;
}

function handleUnauthorizedError(
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>,
  tokenService: TokenService,
  accountService: AccountService,
  router: Router
): Observable<HttpEvent<any>> {
  return tokenService.authState$.pipe(
    switchMap((isLoggedIn) => {
      if (isLoggedIn) {
        return refreshToken(tokenService, accountService, router).pipe(
          switchMap(() => {
            const newToken = tokenService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken || ''}` },
            });
            return next(retryReq);
          }),
          catchError(() => {
            handleAuthError(tokenService, router);
            return throwError(
              () => new Error('Token refresh failed. Redirecting to login.')
            );
          })
        );
      } else {
        handleAuthError(tokenService, router);
        return throwError(() => new Error('User is not logged in.'));
      }
    })
  );
}

function refreshToken(
  tokenService: TokenService,
  accountService: AccountService,
  router: Router
): Observable<any> {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    handleAuthError(tokenService, router);
    return throwError(() => new Error('No refresh token available.'));
  }

  return accountService.refreshToken(refreshToken).pipe(
    tap((response) => {
      if (response.succeeded) {
        tokenService.setAccessToken(response.data!.jwToken);
        tokenService.setRefreshToken(response.data!.refreshToken);
      } else {
        throwError(() => new Error(response.message));
      }
    }),
    catchError((error) => {
      handleAuthError(tokenService, router);
      return throwError(() => new Error('Refresh token expired or invalid.'));
    })
  );
}

function handleAuthError(tokenService: TokenService, router: Router): void {
  tokenService.removeAccessToken();
  tokenService.removeRefreshToken();
  router.navigate(['/login']);
}
