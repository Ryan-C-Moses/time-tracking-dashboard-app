import { request } from './api';
import log from '../config/logger';

export const fetchTasks = async () => {
  try {
    const data = await request('/api/tasks', { auth: true });
    return data;
  } catch (err) {
    log.error(err.message, 'fetchTask Func', err);
  }
};

export const createTask = async (body) => {
  try {
    await request('/api/tasks', { method: 'POST', body, auth: true });
  } catch (err) {
    log.error(err.message, 'createTask Func', err);
  }
};

export const updateTask = async (body) => {
  const { task_id, entry_id } = body;

  try {
    await request(`/api/tasks/${task_id}/entries/${entry_id}`, {
      method: 'PUT',
      body,
      auth: true,
    });
  } catch (err) {
    log.error(err.message, 'updateTask Func', err);
  }
};

export const deleteTask = async (id) => {
  try {
    await request(`/api/tasks/${id}`, { method: 'DELETE', auth: true });
  } catch (err) {
    log.error(err.message, 'deleteTask Func', err)
  }
};
