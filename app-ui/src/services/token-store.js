import {jwtDecode} from 'jwt-decode';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    const result = Date.now() >= exp * 1000;
    if (result) clearToken();
    return result;
  } catch {
    return true; // if invalid
  }
};
