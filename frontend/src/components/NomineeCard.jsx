import { motion } from 'framer-motion';
import { FiCheck, FiUser } from 'react-icons/fi';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const NomineeCard = ({ nominee, selected, onSelect }) => {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(nominee._id)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 ${
        selected
          ? 'border-gold-400 bg-gold-400/10 shadow-gold'
          : 'border-white/10 bg-onyx-800/60 hover:border-gold-400/40'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-onyx-700">
        {nominee.image ? (
          <img
            src={resolveImageUrl(nominee.image)}
            alt={nominee.nomineeName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <FiUser size={40} />
          </div>
        )}
        {selected && (
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient text-onyx-950 shadow-gold">
            <FiCheck size={16} strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-semibold text-ivory">{nominee.nomineeName}</p>
        {nominee.bio && <p className="mt-0.5 line-clamp-2 text-xs text-white/40">{nominee.bio}</p>}
      </div>
    </motion.button>
  );
};

export default NomineeCard;
