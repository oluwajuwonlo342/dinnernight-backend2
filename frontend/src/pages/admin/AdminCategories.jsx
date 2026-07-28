import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';

const emptyForm = { categoryName: '', description: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/categories');
      setCategories(data.categories);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (category) => {
    setEditingId(category._id);
    setForm({ categoryName: category.categoryName, description: category.description || '' });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/admin/categories', form);
        toast.success('Category created');
      }
      setFormOpen(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/categories/${deleteTarget._id}`);
      toast.success('Category deleted');
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Award Categories</h1>
          <p className="mt-1 text-sm text-white/50">Manage the categories students will vote in</p>
        </div>
        <button onClick={openCreate} className="btn-gold px-5 py-2.5 text-sm">
          <FiPlus /> New Category
        </button>
      </div>

      {loading ? (
        <Loader label="Loading categories" />
      ) : categories.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/40">No categories yet. Create your first one.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card-panel flex flex-col gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-ivory">{cat.categoryName}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                    cat.isActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {cat.description && <p className="text-sm text-white/50 line-clamp-2">{cat.description}</p>}
              <div className="mt-auto flex gap-2 pt-2">
                <button onClick={() => openEdit(cat)} className="btn-outline flex-1 py-2 text-xs">
                  <FiEdit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-500/30 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
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
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Category Name</label>
                <input
                  className="input-field"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  placeholder="e.g. Best Dressed Male"
                />
              </div>
              <div>
                <label className="label-field">Description (optional)</label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown to students"
                />
              </div>
              <button type="submit" disabled={saving} className="btn-gold w-full py-3">
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this category?"
        message={`This will permanently remove "${deleteTarget?.categoryName}" along with all of its nominees and votes.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminCategories;
