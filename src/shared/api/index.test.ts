import { describe, expect, it } from 'vitest';
import * as apiExports from './index';

describe('shared API exports', () => {
  it('should export apiClient', () => {
    expect(apiExports.apiClient).toBeDefined();
  });

  it('should export handleApiError', () => {
    expect(apiExports.handleApiError).toBeDefined();
  });

  it('should export interceptor functions', () => {
    expect(apiExports.getToken).toBeDefined();
    expect(apiExports.setToken).toBeDefined();
    expect(apiExports.removeToken).toBeDefined();
  });
});
