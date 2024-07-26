export interface AuthenticationResponse {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  isVerified: boolean;
  jwToken: string;
  refreshToken: string;
}
