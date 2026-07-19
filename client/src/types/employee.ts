export type Role = 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: Status;
  role: Role;
  profileImageUrl: string | null;
  reportingManagerId: string | null;
}
