import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getOrgTree, assignManager, type OrgTreeNode } from '../api/organizationApi';
import { getEmployees } from '../api/employeeApi';
import { OrgNode } from '../components/OrgNode';

export function OrgTreePage() {
  const [tree, setTree] = useState<OrgTreeNode[]>([]);
  const [allEmployees, setAllEmployees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [treeData, empData] = await Promise.all([
        getOrgTree(),
        getEmployees({ limit: 1000 }),
      ]);
      setTree(treeData);
      setAllEmployees(empData.data.map((e) => ({ id: e.id, name: e.name })));
    } catch {
      setError('Failed to load organization tree');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAssign(employeeId: string, managerId: string | null) {
    setError('');
    try {
      await assignManager(employeeId, managerId);
      await loadData();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to assign manager');
      } else {
        setError('Failed to assign manager');
      }
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-1 text-slate-900 dark:text-slate-100">Organization Chart</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Reporting structure across the company</p>
      {loading && <p className="text-slate-500 dark:text-slate-400">Loading...</p>}
      {error && <p className="text-rose-600 dark:text-rose-400 mb-4">{error}</p>}
      {!loading && tree.length === 0 && <p className="text-slate-500 dark:text-slate-400">No employees found.</p>}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        {tree.map((root) => (
          <OrgNode key={root.id} node={root} allEmployees={allEmployees} onAssign={handleAssign} />
        ))}
      </div>
    </Layout>
  );
}