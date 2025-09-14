import { request } from './api';

const USER_KEY = 'user';

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (err) {
    console.log(err);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const fetchMe = async () => {
  const data = await request('/api/me', { auth: true });
  return data;
};
