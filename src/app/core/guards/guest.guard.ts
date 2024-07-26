import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service'; // Import TokenService
import { Observable, of } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getAccessToken();

  if (token) {
    // User is authenticated
    router.navigate(['/todo']);
    return of(false);
  } else {
    // User is not authenticated, allow access
    return of(true);
  }
};
