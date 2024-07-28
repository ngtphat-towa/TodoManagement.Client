import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { map } from 'rxjs';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.authState$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        console.log('AuthGuard: Token exists, user is authenticated');
        return true;
      } else {
        console.log('AuthGuard: Token does not exist, redirecting to login');
        router.navigate(['/']);
        return false;
      }
    })
  );
};
