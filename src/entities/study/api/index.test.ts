import { describe, expect, it } from 'vitest';
import * as studyApiExports from './index';

describe('entities/study/api index', () => {
  it('should export studyApi', () => {
    expect(studyApiExports.studyApi).toBeDefined();
  });
});
