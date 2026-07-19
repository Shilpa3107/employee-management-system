import api from './axiosInstance';

export interface OrgTreeNode {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  role: string;
  reportingManagerId: string | null;
  directReports: OrgTreeNode[];
}

export async function getOrgTree(): Promise<OrgTreeNode[]> {
  const res = await api.get<OrgTreeNode[]>('/organization/tree');
  return res.data;
}

export async function assignManager(employeeId: string, managerId: string | null): Promise<void> {
  await api.patch(`/employees/${employeeId}/manager`, { managerId });
}