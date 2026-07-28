import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiUpload } from 'react-icons/fi';
import api from '../../api/axios';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';

const AdminNominees = () => {
  const [nominees, setNominees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nomineesRes, categoriesRes] = await Promise.all([
        api.get('/admin/nominees', { params: filterCategory ? { categoryId: filterCategory } : {} }),
        api.get('/admin/categories'),
      ]);
      setNominees(nomineesRes.data.nominees);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load nominees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategoryId('');
    setBio('');
    setImageFile(null);
    setPreview('');
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (nominee) => {
    setEditingId(nominee._id);
    setName(nominee.nomineeName);
    setCategoryId(nominee.categoryId?._id || nominee.categoryId);
    setBio(nominee.bio || '');
    setPreview(nominee.image ? resolveImageUrl(nominee.image) : '');
    setImageFile(null);
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      toast.error('Nominee name and category are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nomineeName', name);
      fd.append('categoryId', categoryId);
      fd.append('bio', bio);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/admin/nominees/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Nominee updated');
      } else {
        await api.post('/admin/nominees', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Nominee added');
      }
      setFormOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save nominee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/nominees/${deleteTarget._id}`);
      toast.success('Nominee deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete nominee');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Nominees</h1>
          <p className="mt-1 text-sm text-white/50">Manage nominees for each award category</p>
        </div>
        <button onClick={openCreate} className="btn-gold px-5 py-2.5 text-sm">
          <FiPlus /> Add Nominee
        </button>
      </div>

      <div className="mt-5">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading nominees" />
      ) : nominees.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/40">No nominees found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {nominees.map((nom, idx) => (
            <motion.div
              key={nom._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="card-panel overflow-hidden"
            >
              <div className="aspect-[4/3] w-full bg-onyx-700">
                {nom.image ? (
                  <img src={resolveImageUrl(nom.image)} alt={nom.nomineeName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    <FiUser size={32} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-semibold text-ivory">{nom.nomineeName}</p>
                <p className="truncate text-xs text-gold-300/70">{nom.categoryId?.categoryName}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(nom)} className="btn-outline flex-1 py-1.5 text-xs">
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(nom)}
                    className="flex flex-1 items-center justify-center rounded-full border border-red-500/30 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto"
          onClick={() => setFormOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-panel w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ivory">
                {editingId ? 'Edit Nominee' : 'Add Nominee'}
              </h3>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
                <label className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gold-400/40 bg-onyx-700 text-white/30 hover:border-gold-400">
                  {preview ? (
                    <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <FiUpload size={22} />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="label-field">Nominee Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nominee's full name" />
              </div>

              <div>
                <label className="label-field">Category</label>
                <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-field">Bio (optional)</label>
                <textarea
                  className="input-field min-h-[70px] resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short description"
                />
              </div>

              <button type="submit" disabled={saving} className="btn-gold w-full py-3">
                {saving ? 'Saving...' : editingId ? 'Update Nominee' : 'Add Nominee'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this nominee?"
        message={`This will permanently remove "${deleteTarget?.nomineeName}" and all associated votes.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminNominees;
