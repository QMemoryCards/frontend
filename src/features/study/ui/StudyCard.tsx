import React from 'react';
import styled from 'styled-components';

interface StudyCardProps {
  question: string;
  answer: string;
  showAnswer: boolean;
  onToggleAnswer: () => void;
}

const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  padding: 48px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
    min-height: 320px;
  }
`;

const CardSide = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 24px;
`;

const Text = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #262626;
  line-height: 1.5;
  word-wrap: break-word;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Hint = styled.div`
  margin-top: 32px;
  font-size: 14px;
  color: #8c8c8c;
`;

export const StudyCard: React.FC<StudyCardProps> = ({ question, answer, showAnswer, onToggleAnswer }) => {
  return (
    <CardContainer onClick={onToggleAnswer}>
      <CardSide $show={!showAnswer}>
        <Label>Вопрос</Label>
        <Text>{question}</Text>
        <Hint>Нажмите, чтобы увидеть ответ</Hint>
      </CardSide>

      <CardSide $show={showAnswer}>
        <Label>Ответ</Label>
        <Text>{answer}</Text>
      </CardSide>
    </CardContainer>
  );
};
