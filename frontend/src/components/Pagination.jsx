import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30"
      >
        <FiChevronLeft />
      </button>

      {pageNumbers.map((p, idx) => (
        <div key={p} className="flex items-center gap-1.5">
          {idx > 0 && pageNumbers[idx - 1] !== p - 1 && <span className="px-1 text-white/30">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
              p === page
                ? 'bg-gold-gradient text-onyx-950'
                : 'border border-white/10 text-white/60 hover:border-gold-400/50 hover:text-gold-300'
            }`}
          >
            {p}
          </button>
        </div>
      ))}

      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
