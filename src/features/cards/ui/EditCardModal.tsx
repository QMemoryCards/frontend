import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Input } from '@shared/ui';
import type { Card, UpdateCardRequest } from '@entities/card';
import { validateCardQuestion, validateCardAnswer } from '@shared/lib/validation';
import { VALIDATION } from '@shared/config';

interface EditCardModalProps {
  isOpen: boolean;
  card: Card | null;
  onClose: () => void;
  onSubmit: (cardId: string, data: UpdateCardRequest) => Promise<void>;
  isLoading: boolean;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #262626;
`;

const ErrorText = styled.span`
  font-size: 13px;
  color: #ff4d4f;
  line-height: 1.4;
`;

const CharCounter = styled.span<{ $isError: boolean }>`
  font-size: 13px;
  color: ${props => (props.$isError ? '#ff4d4f' : '#8c8c8c')};
`;

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  card,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    if (isOpen && card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      setQuestionError('');
      setAnswerError('');
    }
  }, [isOpen, card]);

  useEffect(() => {
    const validation = validateCardQuestion(question);
    setQuestionError(validation.isValid ? '' : validation.error || '');
  }, [question]);

  useEffect(() => {
    const validation = validateCardAnswer(answer);
    setAnswerError(validation.isValid ? '' : validation.error || '');
  }, [answer]);

  const handleSubmit = async () => {
    if (!card) return;

    const questionValidation = validateCardQuestion(question);
    const answerValidation = validateCardAnswer(answer);

    if (!questionValidation.isValid) {
      setQuestionError(questionValidation.error || '');
      return;
    }

    if (!answerValidation.isValid) {
      setAnswerError(answerValidation.error || '');
      return;
    }

    try {
      await onSubmit(card.id, {
        question: question.trim(),
        answer: answer.trim(),
      });
      onClose();
    } catch {
      // Ошибка обработана в хуке
    }
  };

  const isFormValid =
    question.trim() !== '' && answer.trim() !== '' && !questionError && !answerError;

  return (
    <Modal
      title="Редактировать карточку"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={isLoading}
      okButtonProps={{ disabled: !isFormValid }}
      width={520}
    >
      <FormContainer>
        <FieldContainer>
          <Label>Вопрос</Label>
          <Input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={isLoading}
            placeholder="Введите вопрос"
          />
          {questionError ? (
            <ErrorText>{questionError}</ErrorText>
          ) : (
            <CharCounter $isError={question.length > VALIDATION.CARD.MAX_LENGTH}>
              {question.length}/{VALIDATION.CARD.MAX_LENGTH}
            </CharCounter>
          )}
        </FieldContainer>

        <FieldContainer>
          <Label>Ответ</Label>
          <Input
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={isLoading}
            placeholder="Введите ответ"
          />
          {answerError ? (
            <ErrorText>{answerError}</ErrorText>
          ) : (
            <CharCounter $isError={answer.length > VALIDATION.CARD.MAX_LENGTH}>
              {answer.length}/{VALIDATION.CARD.MAX_LENGTH}
            </CharCounter>
          )}
        </FieldContainer>
      </FormContainer>
    </Modal>
  );
};
