import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getAccessToken();

  if (token) {
    // Token exists, user is authenticated
    return of(true);
  } else {
    // Token does not exist, user is not authenticated
    router.navigate(['/login']);
    return of(false);
  }
};
