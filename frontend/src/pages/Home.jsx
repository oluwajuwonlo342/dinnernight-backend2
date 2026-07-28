import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-onyx-950 bg-spotlight px-4 text-center">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(226,169,47,0.06),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex max-w-2xl flex-col items-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
          <FiAward size={30} className="text-onyx-950" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-300/80">
          Moor Plantation Presents
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ivory sm:text-6xl">
          The Dinner Night <span className="text-gold-300">Award</span> Voting Platform
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
          Cast your vote for the standout students of the year. One student, one vote per category — make it
          count.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="btn-gold px-8 py-3.5">
            Login to Vote <FiArrowRight />
          </Link>
          <Link to="/register" className="btn-outline px-8 py-3.5">
            Register as Student
          </Link>
        </div>
      </motion.div>

      <div className="divider-gold absolute bottom-10 w-1/3" />
    </div>
  );
};

export default Home;
