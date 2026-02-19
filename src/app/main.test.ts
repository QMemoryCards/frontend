import { describe, expect, it } from 'vitest';

describe('main app imports', () => {
  it('should import without errors', async () => {
    const app = await import('./App');
    expect(app).toBeDefined();
  }, 10000);
});
