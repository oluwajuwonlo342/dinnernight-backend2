import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import Loader from './Loader';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return <Loader fullscreen label="Checking admin session" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
};

export default AdminProtectedRoute;
