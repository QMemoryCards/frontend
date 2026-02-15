import { describe, it, expect } from 'vitest';
import * as deckSharedPageExports from './index';

describe('pages/deck-shared index', () => {
  it('should export SharedDeckPage', () => {
    expect(deckSharedPageExports.SharedDeckPage).toBeDefined();
  });
});
