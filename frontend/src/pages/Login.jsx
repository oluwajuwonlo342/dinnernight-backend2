import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiAward, FiLock, FiHash, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await login(formData.matricNumber, formData.password);
      toast.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-onyx-950 bg-spotlight px-4 py-10">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-panel w-full max-w-md p-8"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
            <FiAward size={26} className="text-onyx-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ivory">Welcome Back</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to vote for the Dinner Night Awards</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-field">Matric Number</label>
            <div className="relative">
              <FiHash className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="e.g. MP/2023/0145"
                className="input-field pl-10"
                {...register('matricNumber', { required: 'Matric number is required' })}
              />
            </div>
            {errors.matricNumber && <p className="mt-1 text-xs text-red-400">{errors.matricNumber.message}</p>}
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="input-field pl-10 pr-10"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-gold mt-2 w-full py-3">
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          New student?{' '}
          <Link to="/register" className="font-semibold text-gold-300 hover:text-gold-200">
            Create an account
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-white/25">
          <Link to="/admin/login" className="hover:text-white/50">
            Admin login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
