import { describe, expect, it } from 'vitest';
import * as studyModelExports from './index';

describe('features/study/model index', () => {
  it('should export useStudy', () => {
    expect(studyModelExports.useStudy).toBeDefined();
  });
});
