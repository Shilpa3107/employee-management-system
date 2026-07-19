import { useState } from 'react';
import type { OrgTreeNode } from '../api/organizationApi';
import { useAuth } from '../context/AuthContext';

const roleStyles: Record<string, string> = {
  SUPER_ADMIN: 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
  HR_MANAGER: 'border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30',
  EMPLOYEE: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800',
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
      <div className={`inline-block border-2 rounded-lg px-4 py-2.5 my-1.5 ${roleStyles[node.role] || 'bg-white dark:bg-slate-800'}`}>
        <div className="flex items-start gap-2">
          {hasReports && (
            <button onClick={() => setCollapsed((c) => !c)} className="text-slate-400 dark:text-slate-500 text-xs w-4 mt-1">
              {collapsed ? '▶' : '▼'}
            </button>
          )}
          <div>
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{node.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{node.designation} · {node.department}</p>
            {canManage && (
              <select
                value={node.reportingManagerId ?? ''}
                onChange={(e) => onAssign(node.id, e.target.value || null)}
                className="mt-1.5 text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded px-1.5 py-1 w-full"
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
        <div className="border-l-2 border-slate-200 dark:border-slate-700 ml-3">
          {node.directReports.map((child) => (
            <OrgNode key={child.id} node={child} allEmployees={allEmployees} onAssign={onAssign} />
          ))}
        </div>
      )}
    </div>
  );
}