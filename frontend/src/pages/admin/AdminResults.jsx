import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiDownload, FiRefreshCw, FiAward } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadResults = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get('/admin/votes/results');
      setResults(data.results);
    } catch (err) {
      if (!silent) toast.error(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
    // Poll for live updates every 10 seconds without a full page refresh
    const interval = setInterval(() => loadResults(true), 10000);
    return () => clearInterval(interval);
  }, [loadResults]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get('/admin/votes/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voting-results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Results exported successfully');
    } catch (err) {
      toast.error('Failed to export results');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Live Results</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
            <FiRefreshCw size={13} className="animate-spin [animation-duration:3s]" /> Updates automatically every 10s
          </p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="btn-gold px-5 py-2.5 text-sm">
          <FiDownload /> {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {loading ? (
        <Loader label="Loading results" />
      ) : results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/40">No categories yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {results.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-panel p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ivory">{category.categoryName}</h2>
                <span className="text-xs text-white/40">{category.totalVotes} total votes</span>
              </div>

              <div className="space-y-3">
                {category.nominees.length === 0 ? (
                  <p className="text-sm text-white/30">No nominees in this category.</p>
                ) : (
                  category.nominees.map((nom, i) => {
                    const pct = category.totalVotes > 0 ? Math.round((nom.voteCount / category.totalVotes) * 100) : 0;
                    return (
                      <div key={nom._id} className="flex items-center gap-3">
                        <div className="flex w-8 shrink-0 justify-center">
                          {i === 0 && nom.voteCount > 0 ? (
                            <FiAward className="text-gold-400" size={16} />
                          ) : (
                            <span className="text-xs text-white/30">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-ivory">{nom.nomineeName}</span>
                            <span className="text-white/50">
                              {nom.voteCount} vote{nom.voteCount !== 1 && 's'} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-onyx-700">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full bg-gold-gradient"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResults;
