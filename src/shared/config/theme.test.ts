import { describe, expect, it } from 'vitest';
import { antdTheme } from './theme';

describe('antdTheme', () => {
  it('should have token configuration', () => {
    expect(antdTheme.token).toBeDefined();
  });

  it('should have correct color configuration', () => {
    expect(antdTheme.token.colorPrimary).toBe('#1890ff');
    expect(antdTheme.token.colorSuccess).toBe('#52c41a');
    expect(antdTheme.token.colorWarning).toBe('#faad14');
    expect(antdTheme.token.colorError).toBe('#ff4d4f');
    expect(antdTheme.token.colorInfo).toBe('#1890ff');
  });

  it('should have correct font configuration', () => {
    expect(antdTheme.token.fontSize).toBe(14);
    expect(antdTheme.token.fontFamily).toBe(
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    );
  });

  it('should have correct border configuration', () => {
    expect(antdTheme.token.borderRadius).toBe(6);
  });

  it('should have background colors', () => {
    expect(antdTheme.token.colorBgContainer).toBe('#ffffff');
    expect(antdTheme.token.colorBgLayout).toBe('#f0f2f5');
  });

  it('should have components configuration', () => {
    expect(antdTheme.components).toBeDefined();
  });

  it('should have Button component styles', () => {
    expect(antdTheme.components.Button).toBeDefined();
    expect(antdTheme.components.Button.controlHeight).toBe(40);
    expect(antdTheme.components.Button.fontWeight).toBe(500);
  });

  it('should have Input component styles', () => {
    expect(antdTheme.components.Input).toBeDefined();
    expect(antdTheme.components.Input.controlHeight).toBe(40);
  });

  it('should have Modal component styles', () => {
    expect(antdTheme.components.Modal).toBeDefined();
    expect(antdTheme.components.Modal.borderRadiusLG).toBe(8);
  });
});
