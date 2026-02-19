import { describe, expect, it } from 'vitest';
import * as widgetsExports from './index';

describe('widgets index', () => {
  it('should export Header', () => {
    expect(widgetsExports.Header).toBeDefined();
  });
});
