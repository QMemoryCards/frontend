import { describe, expect, it } from 'vitest';
import * as decksModelExports from './index';

describe('features/decks/model index', () => {
  it('should export useDecks', () => {
    expect(decksModelExports.useDecks).toBeDefined();
  });

  it('should export useCreateDeck', () => {
    expect(decksModelExports.useCreateDeck).toBeDefined();
  });

  it('should export useGetDeck', () => {
    expect(decksModelExports.useGetDeck).toBeDefined();
  });

  it('should export useUpdateDeck', () => {
    expect(decksModelExports.useUpdateDeck).toBeDefined();
  });

  it('should export useDeleteDeck', () => {
    expect(decksModelExports.useDeleteDeck).toBeDefined();
  });
});
