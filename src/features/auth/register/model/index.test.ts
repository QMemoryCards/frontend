import { describe, it, expect } from 'vitest';
import * as registerModelExports from './index';

describe('features/auth/register/model index', () => {
  it('should export useRegister', () => {
    expect(registerModelExports.useRegister).toBeDefined();
  });
});
