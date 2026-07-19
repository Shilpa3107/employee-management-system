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

  if (loading) return <Layout><p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p></Layout>;
  if (error) return <Layout><p className="text-rose-600 dark:text-rose-400">{error}</p></Layout>;

  const total = employees.length;
  const active = employees.filter((e) => e.status === 'ACTIVE').length;
  const inactive = employees.filter((e) => e.status === 'INACTIVE').length;
  const departmentCount = new Set(employees.map((e) => e.department)).size;

  const stats = [
    { label: 'Total Employees', value: total, accent: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Active Employees', value: active, accent: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Inactive Employees', value: inactive, accent: 'text-slate-400 dark:text-slate-500' },
    { label: 'Departments', value: departmentCount, accent: 'text-violet-600 dark:text-violet-400' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-1 text-slate-900 dark:text-slate-100">Dashboard</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Overview of your organization</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <p className={`text-3xl font-bold ${s.accent}`}>{s.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}