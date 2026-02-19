import { describe, expect, it } from 'vitest';
import * as styles from './WelcomePage.styles';

describe('WelcomePage styles', () => {
  it('should export styled components', () => {
    expect(styles.WelcomeContainer).toBeDefined();
  });
});
