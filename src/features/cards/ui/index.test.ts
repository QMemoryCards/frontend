import { describe, it, expect } from 'vitest';
import * as cardsUiExports from './index';

describe('features/cards/ui index', () => {
  it('should export CreateCardModal', () => {
    expect(cardsUiExports.CreateCardModal).toBeDefined();
  });

  it('should export EditCardModal', () => {
    expect(cardsUiExports.EditCardModal).toBeDefined();
  });
});
