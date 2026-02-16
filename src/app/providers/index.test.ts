import { describe, expect, it } from 'vitest';
import { ErrorBoundary } from './index';

describe('app/providers index', () => {
  it('should export ErrorBoundary', () => {
    expect(ErrorBoundary).toBeDefined();
  });
});
