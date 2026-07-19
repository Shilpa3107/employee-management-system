import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { createEmployee } from '../api/employeeApi';
import axios from 'axios';

export function EmployeeForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeCode: '', name: '', email: '', password: '', phone: '',
    department: '', designation: '', salary: '', joiningDate: '', role: 'EMPLOYEE',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError('Phone must be exactly 10 digits');
      return;
    }
    if (Number(form.salary) <= 0) {
      setError('Salary must be a positive number');
      return;
    }

    setSubmitting(true);
    try {
      await createEmployee({
        ...form,
        salary: Number(form.salary),
        role: form.role,
      });
      navigate('/employees');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create employee');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Code</label>
            <input required value={form.employeeCode} onChange={(e) => update('employeeCode', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input required type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full border rounded px-3 py-2" />
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
            <label className="block text-sm font-medium mb-1">Joining Date</label>
            <input required type="date" value={form.joiningDate} onChange={(e) => update('joiningDate', e.target.value)} className="w-full border rounded px-3 py-2" />
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
            {submitting ? 'Creating...' : 'Create Employee'}
          </button>
          <button type="button" onClick={() => navigate('/employees')} className="border px-4 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
}