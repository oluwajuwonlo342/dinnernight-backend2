import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiClock, FiLock } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import NomineeCard from '../components/NomineeCard';
import ConfirmModal from '../components/ConfirmModal';
import CountdownTimer from '../components/CountdownTimer';

const Dashboard = () => {
  const { student, markVoted } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);
  const [selections, setSelections] = useState({}); // { categoryId: nomineeId }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, categoriesRes] = await Promise.all([
        api.get('/votes/status'),
        api.get('/categories'),
      ]);
      setStatus(statusRes.data);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load voting data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelect = (categoryId, nomineeId) => {
    setSelections((prev) => ({ ...prev, [categoryId]: nomineeId }));
  };

  const allSelected = categories.length > 0 && categories.every((cat) => selections[cat._id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const votes = Object.entries(selections).map(([categoryId, nomineeId]) => ({ categoryId, nomineeId }));
      await api.post('/votes', { votes });
      markVoted();
      toast.success('Votes submitted successfully!');
      navigate('/vote-success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit votes');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullscreen label="Loading award categories" />;

  const votingClosed = status && (!status.votingOpen || status.hasVoted);

  return (
    <div className="min-h-screen bg-onyx-950 bg-spotlight pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300/80">
            {status?.eventName || 'Dinner Night Awards'}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">
            Welcome, {student?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {status?.hasVoted
              ? 'Thank you for casting your vote.'
              : 'Select one nominee in each category, then submit your votes.'}
          </p>
        </motion.div>

        {status?.votingOpen && status?.votingClosesAt && !status?.hasVoted && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gold-400/20 bg-onyx-800/50 p-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <FiClock className="text-gold-400" /> Voting closes in
            </div>
            <CountdownTimer closesAt={status.votingClosesAt} onExpire={loadData} />
          </div>
        )}

        {status?.hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-panel mt-8 flex flex-col items-center gap-3 p-10 text-center"
          >
            <FiCheckCircle className="text-gold-400" size={44} />
            <h2 className="font-display text-xl font-bold text-ivory">
              You have already voted. Thank you for participating.
            </h2>
            <p className="text-sm text-white/50">Results will be announced on the night of the event.</p>
          </motion.div>
        )}

        {!status?.hasVoted && !status?.votingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-panel mt-8 flex flex-col items-center gap-3 p-10 text-center"
          >
            <FiLock className="text-gold-400" size={40} />
            <h2 className="font-display text-xl font-bold text-ivory">Voting is currently closed</h2>
            <p className="text-sm text-white/50">Please check back once the admin opens voting.</p>
          </motion.div>
        )}

        {!votingClosed && (
          <div className="mt-8 space-y-10">
            {categories.map((category, idx) => (
              <motion.section
                key={category._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold text-ivory">{category.categoryName}</h2>
                  <div className="divider-gold flex-1" />
                  {selections[category._id] && <FiCheckCircle className="text-gold-400 shrink-0" />}
                </div>

                {category.nominees.length === 0 ? (
                  <p className="text-sm text-white/30">No nominees added yet for this category.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {category.nominees.map((nominee) => (
                      <NomineeCard
                        key={nominee._id}
                        nominee={nominee}
                        selected={selections[category._id] === nominee._id}
                        onSelect={() => handleSelect(category._id, nominee._id)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            ))}

            {categories.length > 0 && (
              <div className="sticky bottom-4 flex justify-center pt-4">
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={!allSelected}
                  className="btn-gold px-10 py-3.5 text-base shadow-2xl"
                >
                  {allSelected ? 'Submit My Votes' : `Select a nominee in every category (${Object.keys(selections).length}/${categories.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Submit your votes?"
        message="Once submitted, your votes cannot be changed. Please review your selections before confirming."
        confirmLabel="Yes, Submit"
        cancelLabel="Review Again"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
        loading={submitting}
      />
    </div>
  );
};

export default Dashboard;
