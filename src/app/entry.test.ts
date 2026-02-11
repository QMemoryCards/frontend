import { describe, it, expect } from 'vitest';

describe('app entry point', () => {
  it('should have React imported', async () => {
    const React = await import('react');
    expect(React).toBeDefined();
  });

  it('should have ReactDOM imported', async () => {
    const ReactDOM = await import('react-dom/client');
    expect(ReactDOM).toBeDefined();
  });
});
