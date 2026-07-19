import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getEmployeeById, updateEmployee } from '../api/employeeApi';
import axios from 'axios';

export function EmployeeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', department: '', designation: '',
    salary: '', status: 'ACTIVE', role: 'EMPLOYEE',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id)
      .then((emp) => {
        setForm({
          name: emp.name,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          salary: String(emp.salary),
          status: emp.status,
          role: emp.role,
        });
      })
      .catch(() => setError('Failed to load employee'))
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError('');

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError('Phone must be exactly 10 digits');
      return;
    }

    setSubmitting(true);
    try {
      await updateEmployee(id, {
        name: form.name,
        phone: form.phone,
        department: form.department,
        designation: form.designation,
        salary: Number(form.salary),
        status: form.status as 'ACTIVE' | 'INACTIVE',
        role: form.role as 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE',
      });
      navigate('/employees');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update employee');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input required value={form.department} onChange={(e) => update('department', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input required value={form.designation} onChange={(e) => update('designation', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary</label>
            <input required type="number" value={form.salary} onChange={(e) => update('salary', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="EMPLOYEE">Employee</option>
              <option value="HR_MANAGER">HR Manager</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/employees')} className="border px-4 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
}