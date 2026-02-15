import { describe, it, expect } from 'vitest';
import * as studyPageUiExports from './index';

describe('pages/study/ui index', () => {
  it('should export StudyPage', () => {
    expect(studyPageUiExports.StudyPage).toBeDefined();
  });
});
