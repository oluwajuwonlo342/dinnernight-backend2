import { Link } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-onyx-950 bg-spotlight px-4 text-center">
    <FiAward className="text-gold-400" size={48} />
    <h1 className="font-display text-5xl font-bold text-ivory">404</h1>
    <p className="text-white/50">This page does not exist.</p>
    <Link to="/" className="btn-gold px-6 py-3">
      Go Home
    </Link>
  </div>
);

export default NotFound;
