import { describe, expect, it } from 'vitest';
import * as decksExports from './index';

describe('features/decks index', () => {
  it('should export useDecks', () => {
    expect(decksExports.useDecks).toBeDefined();
  });

  it('should export useCreateDeck', () => {
    expect(decksExports.useCreateDeck).toBeDefined();
  });

  it('should export useUpdateDeck', () => {
    expect(decksExports.useUpdateDeck).toBeDefined();
  });

  it('should export useDeleteDeck', () => {
    expect(decksExports.useDeleteDeck).toBeDefined();
  });

  it('should export CreateDeckModal', () => {
    expect(decksExports.CreateDeckModal).toBeDefined();
  });

  it('should export EditDeckModal', () => {
    expect(decksExports.EditDeckModal).toBeDefined();
  });
});
