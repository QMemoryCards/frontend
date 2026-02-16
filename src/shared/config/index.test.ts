import { describe, expect, it } from 'vitest';
import * as configExports from './index';

describe('shared config exports', () => {
  it('should export constants', () => {
    expect(configExports.VALIDATION).toBeDefined();
    expect(configExports.ROUTES).toBeDefined();
    expect(configExports.API_BASE_URL).toBeDefined();
  });

  it('should export antdTheme', () => {
    expect(configExports.antdTheme).toBeDefined();
  });
});
