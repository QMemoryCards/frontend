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
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  width: 100%;
  max-width: 700px;
  height: 85%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CardSide = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 24px;
  overflow: auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

const Text = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
  overflow-y: auto;
  max-height: 100%;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Hint = styled.div`
  margin-top: 14px;
  font-size: 12px;
  color: #8c8c8c;
  flex-shrink: 0;
`;

export const StudyCard: React.FC<StudyCardProps> = ({
  question,
  answer,
  showAnswer,
  onToggleAnswer,
}) => {
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
