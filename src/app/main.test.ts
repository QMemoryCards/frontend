import { describe, it, expect } from 'vitest';

describe('main app imports', () => {
  it('should import without errors', async () => {
    const app = await import('./App');
    expect(app).toBeDefined();
  }, 10000);
});
