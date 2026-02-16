import { describe, expect, it } from 'vitest';
import type * as types from './types';

describe('entities/deck/model index', () => {
  it('should have Deck type', () => {
    const deck: types.Deck = {
      id: '1',
      name: 'Test',
      description: 'Test',
    };
    expect(deck).toBeDefined();
  });
});
