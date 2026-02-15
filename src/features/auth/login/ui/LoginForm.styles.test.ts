import { describe, it, expect } from 'vitest';
import * as styles from './LoginForm.styles';

describe('LoginForm styles', () => {
  it('should export styled components', () => {
    expect(styles.FormContainer).toBeDefined();
  });
});
