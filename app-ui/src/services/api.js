import * as TokenService from './token-store';

export const request = async (
  path,
  { method = 'GET', body, auth = false } = {}
) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${TokenService.getToken()}`;

  try {
    const res = await fetch(`${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = res.json();

    return data;
  } catch (err) {
    console.error(err.message);
  }
};
