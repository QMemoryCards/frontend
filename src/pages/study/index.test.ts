import { describe, it, expect } from 'vitest';
import * as studyPageExports from './index';

describe('pages/study index', () => {
  it('should export StudyPage', () => {
    expect(studyPageExports.StudyPage).toBeDefined();
  });
});
