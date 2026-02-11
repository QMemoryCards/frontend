import { describe, it, expect } from 'vitest';
import type { RouteObject } from 'react-router-dom';

describe('app/routes/types', () => {
  it('should have RouteObject type available', () => {
    const route: RouteObject = {
      path: '/test',
    };
    expect(route).toBeDefined();
  });
});
