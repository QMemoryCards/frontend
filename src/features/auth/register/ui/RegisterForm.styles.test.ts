import { describe, it, expect } from 'vitest';
import * as styles from './RegisterForm.styles';

describe('RegisterForm styles', () => {
  it('should export styled components', () => {
    expect(styles.FormContainer).toBeDefined();
  });
});
