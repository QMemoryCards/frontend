import { describe, expect, it } from 'vitest';
import * as registerUiExports from './index';

describe('features/auth/register/ui index', () => {
  it('should export RegisterForm', () => {
    expect(registerUiExports.RegisterForm).toBeDefined();
  });
});
