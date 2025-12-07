/**
 * Get the BUILD_ID from the environment
 * @returns The BUILD_ID set during build time, or 'dev' if not set
 */
export function getBuildId(): string {
  return import.meta.env.VITE_BUILD_ID || 'dev';
}

/**
 * Get version information for the application
 * @returns Object with build_id and other version info
 */
export function getVersionInfo() {
  return {
    build_id: getBuildId(),
    environment: import.meta.env.MODE,
  };
}
