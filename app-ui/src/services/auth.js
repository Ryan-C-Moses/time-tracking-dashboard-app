import * as TokenService from './token-store';

const API_BASE = import.meta.env.VITE_API_URL;

const request = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${TokenService.getToken()}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = res.json();

    return data;
  } catch (err) {
    console.log(err.message);
    console.log(err);
  }
};

export default request;
