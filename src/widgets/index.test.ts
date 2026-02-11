import { describe, it, expect } from 'vitest';
import * as widgetsExports from './index';

describe('widgets index', () => {
  it('should export Header', () => {
    expect(widgetsExports.Header).toBeDefined();
  });
});
