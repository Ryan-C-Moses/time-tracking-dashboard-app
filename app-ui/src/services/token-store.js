const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
