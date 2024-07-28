import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authStateSubject.asObservable();

  constructor() {}

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || typeof decodedToken.exp !== 'number') {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decodedToken.exp;

    const clockSkewInSeconds = 60;
    return expirationTime < currentTime - clockSkewInSeconds;
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (token && this.isTokenExpired(token)) {
      this.removeAccessToken();
      return null;
    }
    return token;
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.authStateSubject.next(true);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.authStateSubject.next(false);
  }

  getRefreshToken(): string | null {
    const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (token && this.isTokenExpired(token)) {
      this.removeRefreshToken();
      return null;
    }
    return token;
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.authState$;
  }
}
