import { useState } from 'react';
import type { OrgTreeNode } from '../api/organizationApi';
import { useAuth } from '../context/AuthContext';

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'border-purple-400 bg-purple-50',
  HR_MANAGER: 'border-blue-400 bg-blue-50',
  EMPLOYEE: 'border-gray-300 bg-white',
};

interface Props {
  node: OrgTreeNode;
  allEmployees: { id: string; name: string }[];
  onAssign: (employeeId: string, managerId: string | null) => void;
}

export function OrgNode({ node, allEmployees, onAssign }: Props) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const hasReports = node.directReports.length > 0;
  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_MANAGER';

  return (
    <div className="ml-6">
      <div className={`inline-block border-2 rounded-lg px-4 py-2 my-1 shadow-sm ${roleColors[node.role] || 'bg-white'}`}>
        <div className="flex items-center gap-2">
          {hasReports && (
            <button onClick={() => setCollapsed((c) => !c)} className="text-gray-500 text-xs w-4">
              {collapsed ? '▶' : '▼'}
            </button>
          )}
          <div>
            <p className="font-semibold text-sm text-gray-800">{node.name}</p>
            <p className="text-xs text-gray-500">{node.designation} · {node.department}</p>
            {canManage && (
              <select
                value={node.reportingManagerId ?? ''}
                onChange={(e) => onAssign(node.id, e.target.value || null)}
                className="mt-1 text-xs border rounded px-1 py-0.5 w-full"
              >
                <option value="">No manager</option>
                {allEmployees
                  .filter((e) => e.id !== node.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {!collapsed && hasReports && (
        <div className="border-l-2 border-gray-200 ml-3">
          {node.directReports.map((child) => (
            <OrgNode key={child.id} node={child} allEmployees={allEmployees} onAssign={onAssign} />
          ))}
        </div>
      )}
    </div>
  );
}