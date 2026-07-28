import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiTrash2, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/students', { params: { search, page, limit: 10 } });
      setStudents(data.students);
      setPages(data.pagination.pages);
      setTotal(data.pagination.total);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadStudents, 350); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/students/${deleteTarget._id}`);
      toast.success('Student removed');
      setDeleteTarget(null);
      loadStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Registered Students</h1>
          <p className="mt-1 text-sm text-white/50">{total} student{total !== 1 && 's'} registered</p>
        </div>
        <div className="relative w-full max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            className="input-field pl-10"
            placeholder="Search by name, matric, department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading students" />
      ) : students.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/40">No students found.</p>
      ) : (
        <div className="card-panel mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Matric No.</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Level</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-medium text-ivory">{s.fullName}</td>
                  <td className="px-5 py-3 text-white/60">{s.matricNumber}</td>
                  <td className="px-5 py-3 text-white/60">{s.department}</td>
                  <td className="px-5 py-3 text-white/60">{s.level}</td>
                  <td className="px-5 py-3">
                    {s.hasVoted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                        <FiCheckCircle size={12} /> Voted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                        <FiClock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                    >
                      <FiTrash2 size={12} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove this student?"
        message={`"${deleteTarget?.fullName}" will be permanently removed from the register.`}
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminStudents;
