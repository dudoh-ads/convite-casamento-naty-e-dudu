/**
 * Constructs a proper asset URL considering the Vite base URL
 * Works on localhost and GitHub Pages with base path
 */
export const getAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path if it exists to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
