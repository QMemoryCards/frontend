import { describe, expect, it } from 'vitest';
import * as deckExports from './index';

describe('deck entity exports', () => {
  it('should export deck API functions', () => {
    expect(deckExports.createDeck).toBeDefined();
    expect(deckExports.getDecks).toBeDefined();
    expect(deckExports.updateDeck).toBeDefined();
    expect(deckExports.deleteDeck).toBeDefined();
    expect(deckExports.getDeck).toBeDefined();
  });

  it('should export DeckCard component', () => {
    expect(deckExports.DeckCard).toBeDefined();
  });
});
