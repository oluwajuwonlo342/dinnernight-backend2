import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAward, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { student, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-onyx-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <FiAward className="text-gold-400" size={24} />
          <span className="font-display text-base font-bold tracking-wide text-ivory sm:text-lg">
            Moor Plantation <span className="text-gold-300">Dinner Night</span>
          </span>
        </Link>

        {isAuthenticated && (
          <>
            <div className="hidden items-center gap-6 sm:flex">
              <span className="text-sm text-white/60">
                Hi, <span className="font-semibold text-ivory">{student?.fullName?.split(' ')[0]}</span>
              </span>
              <button onClick={handleLogout} className="btn-outline px-4 py-2 text-sm">
                <FiLogOut size={15} /> Logout
              </button>
            </div>

            <button className="text-ivory sm:hidden" onClick={() => setOpen(!open)}>
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </>
        )}
      </div>

      {isAuthenticated && open && (
        <div className="border-t border-white/5 bg-onyx-900 px-4 py-4 sm:hidden">
          <p className="mb-3 text-sm text-white/60">
            Hi, <span className="font-semibold text-ivory">{student?.fullName}</span>
          </p>
          <button onClick={handleLogout} className="btn-outline w-full justify-center py-2.5 text-sm">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
