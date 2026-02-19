import { describe, expect, it } from 'vitest';
import * as studyExports from './index';

describe('entities/study index', () => {
  it('should export studyApi', () => {
    expect(studyExports.studyApi).toBeDefined();
  });
});
