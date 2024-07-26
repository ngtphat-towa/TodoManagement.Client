export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  token: string;
}
