import { describe, expect, it } from 'vitest';
import * as uiExports from './index';

describe('shared UI exports', () => {
  it('should export Button component', () => {
    expect(uiExports.Button).toBeDefined();
  });

  it('should export Input component', () => {
    expect(uiExports.Input).toBeDefined();
  });

  it('should export Spinner component', () => {
    expect(uiExports.Spinner).toBeDefined();
  });
});
