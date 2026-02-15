import { describe, it, expect } from 'vitest';
import * as styles from './WelcomePage.styles';

describe('WelcomePage styles', () => {
  it('should export styled components', () => {
    expect(styles.WelcomeContainer).toBeDefined();
  });
});
