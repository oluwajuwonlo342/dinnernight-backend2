import { AnimatePresence, motion } from 'framer-motion';

const ConfirmModal = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="card-panel w-full max-w-md p-6"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold text-ivory">{title}</h3>
            {message && <p className="mt-3 text-sm leading-relaxed text-white/60">{message}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onCancel} className="btn-outline px-5 py-2.5 text-sm" disabled={loading}>
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={
                  danger
                    ? 'inline-flex items-center gap-2 rounded-full bg-red-600/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50'
                    : 'btn-gold px-5 py-2.5 text-sm'
                }
              >
                {loading ? 'Please wait...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
