import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiAward, FiUser, FiHash, FiBookOpen, FiLayers, FiPhone, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerStudent } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await registerStudent(formData);
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
        className="card-panel w-full max-w-xl p-8"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
            <FiAward size={26} className="text-onyx-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ivory">Student Registration</h1>
          <p className="mt-1 text-sm text-white/50">Create your account to cast your votes</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-field">Full Name</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="John Doe"
                className="input-field pl-10"
                {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Too short' } })}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="label-field">Matric Number</label>
            <div className="relative">
              <FiHash className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="MP/2023/0145"
                className="input-field pl-10"
                {...register('matricNumber', { required: 'Matric number is required' })}
              />
            </div>
            {errors.matricNumber && <p className="mt-1 text-xs text-red-400">{errors.matricNumber.message}</p>}
          </div>

          <div>
            <label className="label-field">Department</label>
            <div className="relative">
              <FiBookOpen className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Computer Science"
                className="input-field pl-10"
                {...register('department', { required: 'Department is required' })}
              />
            </div>
            {errors.department && <p className="mt-1 text-xs text-red-400">{errors.department.message}</p>}
          </div>

          <div>
            <label className="label-field">Level</label>
            <div className="relative">
              <FiLayers className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <select className="input-field pl-10 appearance-none" {...register('level', { required: 'Level is required' })}>
                <option value="">Select level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
            {errors.level && <p className="mt-1 text-xs text-red-400">{errors.level.message}</p>}
          </div>

          <div>
            <label className="label-field">Phone Number (optional)</label>
            <div className="relative">
              <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="tel" placeholder="080..." className="input-field pl-10" {...register('phone')} />
            </div>
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                placeholder="Min. 6 characters"
                className="input-field pl-10"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">Confirm Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                placeholder="Re-enter your password"
                className="input-field pl-10"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-gold sm:col-span-2 mt-2 w-full py-3">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-gold-300 hover:text-gold-200">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
