import { describe, expect, it } from 'vitest';
import * as headerExports from './index';

describe('widgets/Header index', () => {
  it('should export Header', () => {
    expect(headerExports.Header).toBeDefined();
  });
});
