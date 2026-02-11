import { describe, it, expect } from 'vitest';
import * as api from './index';

describe('entities/card/api exports', () => {
  it('should export cardApi', () => {
    expect(api.cardApi).toBeDefined();
  });
});
