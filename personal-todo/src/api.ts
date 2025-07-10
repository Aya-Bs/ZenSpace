// api.ts
import { Task } from './types';

const BASE_URL = 'http://localhost:4000';

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
};

export const createTask = async (task: Omit<Task, '_id'>): Promise<Task> => {

  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
};

export const updateTask = async (task: Task): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks/${task._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
};


export const deleteTask = async (id: string): Promise<void> => {
  await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
};
