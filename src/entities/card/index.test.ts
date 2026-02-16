import { describe, expect, it } from 'vitest';
import * as cardExports from './index';

describe('card entity exports', () => {
  it('should export cardApi', () => {
    expect(cardExports.cardApi).toBeDefined();
  });

  it('should export Card type', () => {
    expect(cardExports).toBeDefined();
  });

  it('should export CardItem component', () => {
    expect(cardExports.CardItem).toBeDefined();
  });
});
