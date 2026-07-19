import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getEmployees } from '../api/employeeApi';
import type { Employee } from '../types/employee';

export function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmployees({ limit: 1000 })
      .then((res) => setEmployees(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><p>Loading dashboard...</p></Layout>;
  if (error) return <Layout><p className="text-red-600">{error}</p></Layout>;

  const total = employees.length;
  const active = employees.filter((e) => e.status === 'ACTIVE').length;
  const inactive = employees.filter((e) => e.status === 'INACTIVE').length;
  const departmentCount = new Set(employees.map((e) => e.department)).size;

  const stats = [
    { label: 'Total Employees', value: total, color: 'bg-blue-600' },
    { label: 'Active Employees', value: active, color: 'bg-green-600' },
    { label: 'Inactive Employees', value: inactive, color: 'bg-gray-500' },
    { label: 'Departments', value: departmentCount, color: 'bg-purple-600' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-5">
            <div className={`w-3 h-3 rounded-full ${s.color} mb-3`} />
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}