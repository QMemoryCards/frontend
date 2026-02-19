import { describe, expect, it } from 'vitest';
import * as profilePageUiExports from './index';

describe('pages/profile/ui index', () => {
  it('should export ProfilePage', () => {
    expect(profilePageUiExports.ProfilePage).toBeDefined();
  });
});
