/**
 * Asset URL helper ensuring images load correctly across all environments,
 * including GitHub Pages (which hosts under a subdirectory repository name)
 * and local/production deployments.
 */
export const getAssetUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip leading slash so it concatenates properly with BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};
