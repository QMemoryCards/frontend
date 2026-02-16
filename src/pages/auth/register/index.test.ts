import { describe, expect, it } from 'vitest';
import * as registerPageExports from './index';

describe('pages/auth/register index', () => {
  it('should export RegisterPage', () => {
    expect(registerPageExports.RegisterPage).toBeDefined();
  });
});
