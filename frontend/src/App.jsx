import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VoteSuccess from './pages/VoteSuccess';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminNominees from './pages/admin/AdminNominees';
import AdminStudents from './pages/admin/AdminStudents';
import AdminResults from './pages/admin/AdminResults';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public / student routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vote-success"
              element={
                <ProtectedRoute>
                  <VoteSuccess />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminProtectedRoute>
                  <AdminCategories />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/nominees"
              element={
                <AdminProtectedRoute>
                  <AdminNominees />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <AdminStudents />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <AdminProtectedRoute>
                  <AdminResults />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute>
                  <AdminSettings />
                </AdminProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          theme="dark"
          toastClassName="!bg-onyx-800 !border !border-white/10 !rounded-xl"
        />
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
