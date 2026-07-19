import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getEmployeeById } from '../api/employeeApi';
import type { Employee } from '../types/employee';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id)
      .then(setEmployee)
      .catch(() => setError('Failed to load employee, or you do not have permission to view this profile'));
  }, [id]);

  if (error) return <Layout><p className="text-red-600">{error}</p></Layout>;
  if (!employee) return <Layout><p>Loading...</p></Layout>;

  const fields: [string, string][] = [
    ['Employee Code', employee.employeeCode],
    ['Name', employee.name],
    ['Email', employee.email],
    ['Phone', employee.phone],
    ['Department', employee.department],
    ['Designation', employee.designation],
    ['Salary', `₹${employee.salary.toLocaleString()}`],
    ['Joining Date', new Date(employee.joiningDate).toLocaleDateString()],
    ['Status', employee.status],
    ['Role', employee.role],
  ];

  return (
    <Layout>
      <Link to="/employees" className="text-blue-600 hover:underline text-sm">← Back to Employees</Link>
      <h1 className="text-2xl font-bold my-4 text-gray-800">{employee.name}</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        {fields.map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b last:border-0">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-800 text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}