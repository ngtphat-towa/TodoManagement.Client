export const API_BASE_URL = 'https://localhost:7243';


export const constants = {
  CURRENT_TOKEN: 'CURRENT_TOKEN',
};

export const API_ROUTES = {
  // Todo
  TODOS: '/api/todos',
  // Account
  AUTHENTICATE: '/api/account/authenticate',
  REGISTER: '/api/account/register',
  CONFIRM_EMAIL: '/api/account/confirm-email',
  FORGOT_PASSWORD: '/api/account/forgot-password',
  RESET_PASSWORD: '/api/account/reset-password',
  LOGOUT: '/api/account/logout',
  REFRESH_TOKEN: '/api/account/refresh-token',
  ROLES: '/api/account/roles', // Base endpoint for roles
  PERMISSIONS: '/api/account/permissions', // Base endpoint for permissions
};
