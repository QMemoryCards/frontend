import { describe, expect, it } from 'vitest';
import * as cardsExports from './index';

describe('features/cards index', () => {
  it('should export useCards', () => {
    expect(cardsExports.useCards).toBeDefined();
  });

  it('should export useCreateCard', () => {
    expect(cardsExports.useCreateCard).toBeDefined();
  });

  it('should export useUpdateCard', () => {
    expect(cardsExports.useUpdateCard).toBeDefined();
  });

  it('should export useDeleteCard', () => {
    expect(cardsExports.useDeleteCard).toBeDefined();
  });

  it('should export CreateCardModal', () => {
    expect(cardsExports.CreateCardModal).toBeDefined();
  });

  it('should export EditCardModal', () => {
    expect(cardsExports.EditCardModal).toBeDefined();
  });
});
