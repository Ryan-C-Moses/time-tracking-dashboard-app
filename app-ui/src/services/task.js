import { request } from './api';

export const fetchTasks = async () => {
  const data = await request('/api/tasks', { auth: true });
  console.log('Task service get request: ', data);
  return data;
};

export const createTask = async (body) => {
  await request('/api/tasks', { method: 'POST', body, auth: true });
};

export const updateTask = async (body) => {
  const { task_id, entry_id } = body;
  await request(`/api/tasks/${task_id}/entries/${entry_id}`, {
    method: 'PUT',
    body,
    auth: true,
  });
};

export const deleteTask = async (id) => {
  await request(`/api/tasks/${id}`, { method: 'DELETE', auth: true });
};
