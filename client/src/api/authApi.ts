import api from './axiosInstance';

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<{ user: { id: string; role: string } }> {
  const res = await api.get('/auth/me');
  return res.data;
}