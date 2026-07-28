import { useEffect, useState } from 'react';

const getTimeLeft = (target) => {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const CountdownTimer = ({ closesAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(closesAt));

  useEffect(() => {
    if (!closesAt) return undefined;

    const interval = setInterval(() => {
      const remaining = getTimeLeft(closesAt);
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [closesAt, onExpire]);

  if (!closesAt || !timeLeft) return null;

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex min-w-[52px] flex-col items-center rounded-lg border border-gold-400/30 bg-onyx-800/80 px-2.5 py-1.5"
        >
          <span className="font-display text-lg font-bold text-gold-300 tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
