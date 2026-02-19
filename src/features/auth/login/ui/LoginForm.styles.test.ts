import { describe, expect, it } from 'vitest';
import * as styles from './LoginForm.styles';

describe('LoginForm styles', () => {
  it('should export styled components', () => {
    expect(styles.FormContainer).toBeDefined();
  });
});
