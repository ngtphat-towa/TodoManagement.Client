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
        console.log('GuestGuard: User is authenticated, redirecting to todo');
        router.navigate(['/todo']);
        return false;
      } else {
        console.log('GuestGuard: User is not authenticated, allowing access');
        return true;
      }
    })
  );
};
