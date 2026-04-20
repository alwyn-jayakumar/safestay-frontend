import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { WorkerDashboard } from './pages/workerDashboard';
import { AdminDashboard } from './pages/adminDashboard';
import { ClientDashboard } from './pages/clientDashboard';
import { Signup } from './pages/signUp';

// Helper component to check permissions
const RoleGuard = ({ component: Component, role }: { component: React.FC, role: string }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading Application...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/login" />;

  return <Component />;
};

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED WORKER */}
            <Route path="/worker" element={<RoleGuard component={WorkerDashboard} role="WORKER" />} />
            <Route path="/admin" element={<RoleGuard component={AdminDashboard} role="ADMIN" />} />
            <Route path="/client" element={<RoleGuard component={ClientDashboard} role="CLIENT" />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}