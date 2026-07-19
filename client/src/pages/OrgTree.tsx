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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Organization Chart</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && tree.length === 0 && <p className="text-gray-500">No employees found.</p>}
      <div className="bg-white rounded-lg shadow p-6">
        {tree.map((root) => (
          <OrgNode key={root.id} node={root} allEmployees={allEmployees} onAssign={handleAssign} />
        ))}
      </div>
    </Layout>
  );
}