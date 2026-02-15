import { describe, it, expect } from 'vitest';
import * as decksUiExports from './index';

describe('features/decks/ui index', () => {
  it('should export CreateDeckModal', () => {
    expect(decksUiExports.CreateDeckModal).toBeDefined();
  });

  it('should export EditDeckModal', () => {
    expect(decksUiExports.EditDeckModal).toBeDefined();
  });
});
