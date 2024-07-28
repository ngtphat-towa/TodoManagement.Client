import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.authState$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigate(['/todo']);
        return false;
      }
      return true;
    })
  );
};
