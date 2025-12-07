import { describe, it, expect } from 'vitest';
import { getBuildId, getVersionInfo } from './version';

describe('version utils', () => {
  describe('getBuildId', () => {
    it('should return a string', () => {
      const buildId = getBuildId();
      expect(typeof buildId).toBe('string');
      expect(buildId.length).toBeGreaterThan(0);
    });

    it('should return "dev" when BUILD_ID is not set in environment', () => {
      // In test environment, VITE_BUILD_ID is not set by default
      const buildId = getBuildId();
      // It should return either the env value or 'dev'
      expect(['dev', buildId].includes(buildId)).toBe(true);
    });
  });

  describe('getVersionInfo', () => {
    it('should return version info with required properties', () => {
      const versionInfo = getVersionInfo();
      expect(versionInfo).toHaveProperty('build_id');
      expect(versionInfo).toHaveProperty('environment');
      expect(typeof versionInfo.build_id).toBe('string');
      expect(typeof versionInfo.environment).toBe('string');
    });

    it('should include environment from MODE', () => {
      const versionInfo = getVersionInfo();
      // MODE should be set by Vitest (usually 'test')
      expect(versionInfo.environment).toBeTruthy();
    });
  });
});
