import { describe, it, expect } from 'vitest';
import type * as types from './types';

describe('entities/deck/model index', () => {
  it('should have Deck type', () => {
    const deck: types.Deck = {
      id: '1',
      title: 'Test',
      description: 'Test',
      cardCount: 0,
      createdAt: '',
      userId: '1',
    };
    expect(deck).toBeDefined();
  });
});
