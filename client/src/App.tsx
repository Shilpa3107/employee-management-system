import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { EmployeeForm } from './pages/EmployeeForm';
import { EmployeeEdit } from './pages/EmployeeEdit';
import { EmployeeDetail } from './pages/EmployeeDetail';
import { OrgTreePage } from './pages/OrgTree';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
                <Route
  path="/employees"
  element={
    <ProtectedRoute>
      <Employees />
    </ProtectedRoute>
  }
/>
<Route
  path="/employees/new"
  element={
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
      <EmployeeForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/employees/:id"
  element={
    <ProtectedRoute>
      <EmployeeDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/employees/:id/edit"
  element={
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
      <EmployeeEdit />
    </ProtectedRoute>
  }
/>
<Route
  path="/organization"
  element={
    <ProtectedRoute>
      <OrgTreePage />
    </ProtectedRoute>
  }
/>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;