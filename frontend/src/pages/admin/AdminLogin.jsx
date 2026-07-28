import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiShield, FiUser, FiLock } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await login(formData.username, formData.password);
      toast.success('Welcome back, admin.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-onyx-950 bg-spotlight px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-panel w-full max-w-sm p-8"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
            <FiShield size={24} className="text-onyx-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ivory">Admin Login</h1>
          <p className="mt-1 text-sm text-white/50">Restricted access — organizers only</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-field">Username</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input className="input-field pl-10" {...register('username', { required: 'Username is required' })} />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                className="input-field pl-10"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-gold mt-2 w-full py-3">
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
