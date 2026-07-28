import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiAward,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/categories', label: 'Categories', icon: FiAward },
  { to: '/admin/nominees', label: 'Nominees', icon: FiAward },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/results', label: 'Results', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Voting Settings', icon: FiSettings },
];

const AdminLayout = ({ children }) => {
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const NavItems = ({ onClick }) => (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-gold-400/15 text-gold-300 border border-gold-400/30'
                : 'text-white/60 hover:bg-white/5 hover:text-ivory border border-transparent'
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-onyx-950 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-onyx-900/60 p-5 lg:flex">
        <div className="mb-8 flex items-center gap-2">
          <FiAward className="text-gold-400" size={24} />
          <span className="font-display text-lg font-bold text-ivory">Admin Panel</span>
        </div>
        <NavItems />
        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="mb-3 truncate text-xs text-white/40">Signed in as {admin?.username}</p>
          <button onClick={handleLogout} className="btn-outline w-full justify-center py-2 text-sm">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-onyx-900/80 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <FiAward className="text-gold-400" size={20} />
          <span className="font-display text-base font-bold text-ivory">Admin Panel</span>
        </div>
        <button className="text-ivory" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-4 border-b border-white/5 bg-onyx-900 p-4 lg:hidden">
          <NavItems onClick={() => setMobileOpen(false)} />
          <button onClick={handleLogout} className="btn-outline w-full justify-center py-2 text-sm">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
