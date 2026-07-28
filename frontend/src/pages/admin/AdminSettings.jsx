import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiLock, FiUnlock, FiSave } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';

const toLocalInputValue = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventName, setEventName] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // 'open' | 'close' | null

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/settings');
      setSettings(data.settings);
      setEventName(data.settings.eventName);
      setClosesAt(toLocalInputValue(data.settings.votingClosesAt));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/admin/settings', {
        eventName,
        votingClosesAt: closesAt ? new Date(closesAt).toISOString() : null,
      });
      setSettings(data.settings);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVoting = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/admin/settings', { votingOpen: !settings.votingOpen });
      setSettings(data.settings);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update voting status');
    } finally {
      setSaving(false);
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader label="Loading settings" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-ivory">Voting Settings</h1>
      <p className="mt-1 text-sm text-white/50">Control when students can vote</p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-panel mt-6 flex flex-wrap items-center justify-between gap-4 p-6"
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40">Current Status</p>
          <p className="font-display text-xl font-bold text-ivory">
            Voting is {settings.votingOpen ? 'OPEN' : 'CLOSED'}
          </p>
        </div>
        <button
          onClick={() => setConfirmAction(settings.votingOpen ? 'close' : 'open')}
          className={settings.votingOpen ? 'btn-outline px-6 py-3' : 'btn-gold px-6 py-3'}
        >
          {settings.votingOpen ? (
            <>
              <FiLock /> Close Voting
            </>
          ) : (
            <>
              <FiUnlock /> Open Voting
            </>
          )}
        </button>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSaveDetails}
        className="card-panel mt-6 max-w-lg space-y-4 p-6"
      >
        <div>
          <label className="label-field">Event Name</label>
          <input className="input-field" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Voting Closes At (optional)</label>
          <input
            type="datetime-local"
            className="input-field"
            value={closesAt}
            onChange={(e) => setClosesAt(e.target.value)}
          />
          <p className="mt-1 text-xs text-white/30">
            Students will see a live countdown. Leave blank for no automatic closing time.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-gold px-6 py-3">
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </motion.form>

      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction === 'open' ? 'Open voting?' : 'Close voting?'}
        message={
          confirmAction === 'open'
            ? 'Students will immediately be able to cast their votes.'
            : 'Students will no longer be able to submit votes until voting is reopened.'
        }
        confirmLabel={confirmAction === 'open' ? 'Open Voting' : 'Close Voting'}
        danger={confirmAction === 'close'}
        onConfirm={handleToggleVoting}
        onCancel={() => setConfirmAction(null)}
        loading={saving}
      />
    </AdminLayout>
  );
};

export default AdminSettings;
