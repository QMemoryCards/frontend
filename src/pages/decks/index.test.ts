import { describe, it, expect } from 'vitest';
import * as decksPageExports from './index';

describe('pages/decks index', () => {
  it('should export DecksPage', () => {
    expect(decksPageExports.DecksPage).toBeDefined();
  });
});
