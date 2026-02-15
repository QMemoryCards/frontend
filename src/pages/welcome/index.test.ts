import { describe, it, expect } from 'vitest';
import * as welcomePageExports from './index';

describe('pages/welcome index', () => {
  it('should export WelcomePage', () => {
    expect(welcomePageExports.WelcomePage).toBeDefined();
  });
});
