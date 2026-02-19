import { describe, expect, it } from 'vitest';
import * as api from './index';

describe('entities/deck/api exports', () => {
  it('should export getDecks', () => {
    expect(api.getDecks).toBeDefined();
  });

  it('should export createDeck', () => {
    expect(api.createDeck).toBeDefined();
  });

  it('should export updateDeck', () => {
    expect(api.updateDeck).toBeDefined();
  });

  it('should export deleteDeck', () => {
    expect(api.deleteDeck).toBeDefined();
  });

  it('should export getDeck', () => {
    expect(api.getDeck).toBeDefined();
  });

  it('should export importSharedDeck', () => {
    expect(api.importSharedDeck).toBeDefined();
  });
});
