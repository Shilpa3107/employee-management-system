import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getEmployees, deleteEmployee } from '../api/employeeApi';
import type { Employee } from '../types/employee';
import { useAuth } from '../context/AuthContext';

export function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getEmployees({ search, department, role, status, sortBy, order, page, limit })
      .then((res) => {
        setEmployees(res.data);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, [search, department, role, status, sortBy, order, page]);

  function toggleSort(field: string) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Soft-delete ${name}? This can be reversed later by an admin.`)) return;
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setTotal((prev) => prev - 1);
  }

  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_MANAGER';

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees ({total})</h1>
        {canManage && (
          <Link
            to="/employees/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Employee
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm w-64"
        />
        <input
          type="text"
          placeholder="Filter by department..."
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm w-48"
        />
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="HR_MANAGER">HR Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('name')}>
                Name {sortBy === 'name' && (order === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('joiningDate')}>
                Joined {sortBy === 'joiningDate' && (order === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">No employees found</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.department}</td>
                  <td className="px-4 py-3">{emp.designation}</td>
                  <td className="px-4 py-3">{emp.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to={`/employees/${emp.id}`} className="text-blue-600 hover:underline">View</Link>
                    {canManage && (
                      <Link to={`/employees/${emp.id}/edit`} className="text-yellow-600 hover:underline">Edit</Link>
                    )}
                    {user?.role === 'SUPER_ADMIN' && (
                      <button onClick={() => handleDelete(emp.id, emp.name)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}