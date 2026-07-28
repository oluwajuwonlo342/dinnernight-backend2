const Loader = ({ label = 'Loading', fullscreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-gold-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-400 animate-spin" />
      </div>
      {label && <p className="text-sm tracking-wide text-white/50">{label}...</p>}
    </div>
  );

  if (fullscreen) {
    return <div className="flex min-h-screen items-center justify-center bg-onyx-950">{content}</div>;
  }

  return <div className="flex items-center justify-center py-16">{content}</div>;
};

export default Loader;
