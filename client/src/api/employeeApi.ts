import api from './axiosInstance';
import type { Employee } from '../types/employee';

export interface PaginatedEmployees {
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmployeeQueryParams {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export async function getEmployees(params: EmployeeQueryParams = {}): Promise<PaginatedEmployees> {
  const res = await api.get<PaginatedEmployees>('/employees', { params });
  return res.data;
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await api.get<Employee>(`/employees/${id}`);
  return res.data;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  role: string;
  reportingManagerId?: string | null;
}

export async function createEmployee(data: CreateEmployeeInput): Promise<Employee> {
  const res = await api.post<Employee>('/employees', data);
  return res.data;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  const res = await api.put<Employee>(`/employees/${id}`, data);
  return res.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await api.delete(`/employees/${id}`);
}