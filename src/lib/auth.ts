import api from './api';

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('picpic_auth_token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('picpic_auth_token');
};

export const saveToken = (token: string): void => {
  localStorage.setItem('picpic_auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('picpic_auth_token');
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch {
    // Silently fail – still clear local token
  } finally {
    removeToken();
  }
};
