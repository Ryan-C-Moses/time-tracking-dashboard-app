import { request } from './api';

export const register = async ({ fname, lname, email, password }) => {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: { fname, lname, email, password },
  });
  console.log(data);
};

export const login = () => {};