import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUsers, FiCheckCircle, FiClock, FiAward, FiUserCheck, FiActivity } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';

const StatCard = ({ icon: Icon, label, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="card-panel flex items-center gap-4 p-5"
  >
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="font-display text-2xl font-bold text-ivory">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setSummary(data.summary);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-ivory">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of the {summary?.eventName || 'event'}</p>

      {loading ? (
        <Loader label="Loading stats" />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={FiUsers}
            label="Total Students"
            value={summary.totalStudents}
            accent="bg-blue-500/15 text-blue-300"
            delay={0}
          />
          <StatCard
            icon={FiCheckCircle}
            label="Students Voted"
            value={summary.votedStudents}
            accent="bg-emerald-500/15 text-emerald-300"
            delay={0.05}
          />
          <StatCard
            icon={FiClock}
            label="Pending Votes"
            value={summary.pendingStudents}
            accent="bg-amber-500/15 text-amber-300"
            delay={0.1}
          />
          <StatCard
            icon={FiAward}
            label="Award Categories"
            value={summary.totalCategories}
            accent="bg-gold-400/15 text-gold-300"
            delay={0.15}
          />
          <StatCard
            icon={FiUserCheck}
            label="Total Nominees"
            value={summary.totalNominees}
            accent="bg-purple-500/15 text-purple-300"
            delay={0.2}
          />
          <StatCard
            icon={FiActivity}
            label="Total Votes Cast"
            value={summary.totalVotes}
            accent="bg-rose-500/15 text-rose-300"
            delay={0.25}
          />
        </div>
      )}

      {!loading && (
        <div className="card-panel mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Voting Status</p>
            <p className="font-display text-lg font-bold text-ivory">
              {summary.votingOpen ? 'Voting is OPEN' : 'Voting is CLOSED'}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              summary.votingOpen ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
            }`}
          >
            {summary.votingOpen ? 'LIVE' : 'CLOSED'}
          </span>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
