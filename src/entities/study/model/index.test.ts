import { describe, expect, it } from 'vitest';
import type * as types from './types';

describe('entities/study/model index', () => {
  it('should have StudySession type', () => {
    const session: types.StudySession = {
      deckId: '1',
      cards: [],
      currentIndex: 0,
      stats: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
    expect(session).toBeDefined();
  });
});
