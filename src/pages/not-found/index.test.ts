import { describe, it, expect } from 'vitest';
import * as notFoundPageExports from './index';

describe('pages/not-found index', () => {
  it('should export NotFoundPage', () => {
    expect(notFoundPageExports.NotFoundPage).toBeDefined();
  });
});
