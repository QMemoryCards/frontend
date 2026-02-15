import { describe, it, expect } from 'vitest';
import * as studyExports from './index';

describe('features/study index', () => {
  it('should export useStudy', () => {
    expect(studyExports.useStudy).toBeDefined();
  });

  it('should export StudyCard', () => {
    expect(studyExports.StudyCard).toBeDefined();
  });
});
