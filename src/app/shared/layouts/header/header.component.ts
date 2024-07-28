import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService, ApiResponse, TokenService } from '../../../core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private tokenService: TokenService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.tokenService.isAuthenticated$().subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  logout(): void {
    this.accountService.logout().subscribe({
      next: (response: ApiResponse<string>) => {
        if (response.succeeded) {
          console.log('Logout successful:', response.message);
          this.router.navigate(['/login']);
        } else {
          console.error('Logout failed:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
