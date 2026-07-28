// Nominee images are stored as relative paths like "/uploads/nominees/xyz.jpg".
// In dev, Vite's proxy makes that work automatically. In production, the
// frontend and backend usually live on different domains, so we prefix
// relative paths with the backend's origin (derived from VITE_API_URL).
const apiBase = import.meta.env.VITE_API_URL || '/api';
const backendOrigin = apiBase.replace(/\/api\/?$/, '');

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${backendOrigin}${path}`;
};
