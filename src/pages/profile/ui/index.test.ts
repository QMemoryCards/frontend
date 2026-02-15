import { describe, it, expect } from 'vitest';
import * as profilePageUiExports from './index';

describe('pages/profile/ui index', () => {
  it('should export ProfilePage', () => {
    expect(profilePageUiExports.ProfilePage).toBeDefined();
  });
});
