import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('div');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with default size', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<Spinner size={40} />);
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with default color', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    const { container } = render(<Spinner color="#ff0000" />);
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeInTheDocument();
  });
});
