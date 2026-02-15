import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StudyCard } from './StudyCard';

describe('StudyCard', () => {
  it('should render study card with question', () => {
    const onToggleAnswer = vi.fn();
    const { container } = render(
      <StudyCard
        question="What is React?"
        answer="A JavaScript library"
        showAnswer={false}
        onToggleAnswer={onToggleAnswer}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render answer when showAnswer is true', () => {
    const onToggleAnswer = vi.fn();
    const { container } = render(
      <StudyCard
        question="What is React?"
        answer="A JavaScript library"
        showAnswer={true}
        onToggleAnswer={onToggleAnswer}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should not render answer when showAnswer is false', () => {
    const onToggleAnswer = vi.fn();
    const { container } = render(
      <StudyCard
        question="What is React?"
        answer="A JavaScript library"
        showAnswer={false}
        onToggleAnswer={onToggleAnswer}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render with long question', () => {
    const onToggleAnswer = vi.fn();
    const { container } = render(
      <StudyCard
        question="This is a very long question that tests the component's ability to handle lengthy text content"
        answer="A short answer"
        showAnswer={false}
        onToggleAnswer={onToggleAnswer}
      />
    );
    expect(container).toBeTruthy();
  });
});
