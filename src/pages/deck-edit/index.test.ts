import { describe, it, expect } from 'vitest';
import * as deckEditPageExports from './index';

describe('pages/deck-edit index', () => {
  it('should export DeckEditPage', () => {
    expect(deckEditPageExports.DeckEditPage).toBeDefined();
  });
});
