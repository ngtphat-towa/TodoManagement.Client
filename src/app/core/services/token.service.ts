import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authStateSubject.asObservable();

  constructor() {}

  // Decode the JWT token
  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  // Check if the token is expired
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

  // Get access token from local storage
  getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (token && this.isTokenExpired(token)) {
      this.removeAccessToken(); // Remove expired token
      return null;
    }
    return token;
  }

  // Set access token to local storage
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.authStateSubject.next(true);
  }

  // Remove access token from local storage
  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.authStateSubject.next(false);
  }

  // Get refresh token from local storage
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Set refresh token to local storage
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // Remove refresh token from local storage
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Check if user is logged in based on token validity
  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Observable to monitor authentication state
  isAuthenticated$(): Observable<boolean> {
    return this.authState$;
  }
}
