import { request } from './api';
import * as TokenService from './token-store';
import { clearUser } from './user';
import { redirectToLogin } from '../utils/constants';

export const register = async ({ fname, lname, email, password }) => {
  const { token } = await request('/api/auth/register', {
    method: 'POST',
    body: { fname, lname, email, password },
  });

  TokenService.setToken(token);
};

export const login = async ({ email, password }) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: true,
  });

  const { user, token } = data;
  TokenService.setToken(token);
  return user;
};

export const logout = (nav) => {
  clearUser();
  TokenService.clearToken();
  redirectToLogin(nav);
};
