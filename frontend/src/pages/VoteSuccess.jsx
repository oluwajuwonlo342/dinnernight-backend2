import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const VoteSuccess = () => {
  return (
    <div className="flex min-h-screen flex-col bg-onyx-950 bg-spotlight">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="card-panel flex max-w-md flex-col items-center gap-4 p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient shadow-gold"
          >
            <FiCheckCircle size={40} className="text-onyx-950" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-ivory">Vote Submitted!</h1>
          <p className="text-sm leading-relaxed text-white/50">
            Thank you for participating in the Moor Plantation Dinner Night Awards. Your votes have been
            recorded successfully. Winners will be announced live on the night of the event.
          </p>
          <div className="divider-gold my-2 w-full" />
          <Link to="/dashboard" className="btn-gold w-full py-3">
            <FiAward /> Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default VoteSuccess;
