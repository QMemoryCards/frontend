import { describe, expect, it } from 'vitest';
import * as libExports from './index';

describe('shared lib exports', () => {
  it('should export toast functions', () => {
    expect(libExports.showSuccess).toBeDefined();
    expect(libExports.showError).toBeDefined();
    expect(libExports.showWarning).toBeDefined();
    expect(libExports.showInfo).toBeDefined();
  });

  it('should export validation functions', () => {
    expect(libExports.validateEmail).toBeDefined();
    expect(libExports.validateLogin).toBeDefined();
    expect(libExports.validatePassword).toBeDefined();
  });
});
