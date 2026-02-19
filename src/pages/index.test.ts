import { describe, expect, it } from 'vitest';
import * as pagesExports from './index';

describe('pages index', () => {
  it('should export WelcomePage', () => {
    expect(pagesExports.WelcomePage).toBeDefined();
  });

  it('should export LoginPage', () => {
    expect(pagesExports.LoginPage).toBeDefined();
  });

  it('should export RegisterPage', () => {
    expect(pagesExports.RegisterPage).toBeDefined();
  });

  it('should export DecksPage', () => {
    expect(pagesExports.DecksPage).toBeDefined();
  });

  it('should export StudyPage', () => {
    expect(pagesExports.StudyPage).toBeDefined();
  });
});
