import { writable } from 'svelte/store';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const token = writable<string | null>(localStorage.getItem('token'));
export const userId = writable<string | null>(localStorage.getItem('userId'));
export const isAuthenticated = writable<boolean>(!!localStorage.getItem('token'));

export async function login(email: string, password: string) {
  try {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    token.set(data.token);
    userId.set(data.userId);
    isAuthenticated.set(true);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const data = await apiRegister(name, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    token.set(data.token);
    userId.set(data.userId);
    isAuthenticated.set(true);
    return data;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  token.set(null);
  userId.set(null);
  isAuthenticated.set(false);
}