import { describe, expect, it } from 'vitest';
import * as profilePageExports from './index';

describe('pages/profile index', () => {
  it('should export ProfilePage', () => {
    expect(profilePageExports.ProfilePage).toBeDefined();
  });
});
