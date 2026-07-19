import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinkClass = "text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3.5 flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <span className="font-bold text-lg tracking-tight text-indigo-600 dark:text-indigo-400">EMS</span>
          <div className="flex gap-6">
            <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
            <Link to="/employees" className={navLinkClass}>Employees</Link>
            <Link to="/organization" className={navLinkClass}>Org Chart</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-md px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-rose-600 text-white px-3.5 py-1.5 rounded-md text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}