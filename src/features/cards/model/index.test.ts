import { describe, expect, it } from 'vitest';
import * as cardsModelExports from './index';

describe('features/cards/model index', () => {
  it('should export useCards', () => {
    expect(cardsModelExports.useCards).toBeDefined();
  });

  it('should export useCreateCard', () => {
    expect(cardsModelExports.useCreateCard).toBeDefined();
  });

  it('should export useUpdateCard', () => {
    expect(cardsModelExports.useUpdateCard).toBeDefined();
  });

  it('should export useDeleteCard', () => {
    expect(cardsModelExports.useDeleteCard).toBeDefined();
  });
});
