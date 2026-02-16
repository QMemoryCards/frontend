import { describe, expect, it } from 'vitest';
import * as studyUiExports from './index';

describe('features/study/ui index', () => {
  it('should export StudyCard', () => {
    expect(studyUiExports.StudyCard).toBeDefined();
  });
});
