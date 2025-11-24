import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Input } from '@shared/ui';
import type { CreateCardRequest } from '@entities/card';
import { validateCardQuestion, validateCardAnswer } from '@shared/lib/validation';
import { VALIDATION } from '@shared/config';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCardRequest) => Promise<void>;
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

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [questionTouched, setQuestionTouched] = useState(false);
  const [answerTouched, setAnswerTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuestion('');
      setAnswer('');
      setQuestionError('');
      setAnswerError('');
      setQuestionTouched(false);
      setAnswerTouched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (questionTouched) {
      const validation = validateCardQuestion(question);
      setQuestionError(validation.isValid ? '' : validation.error || '');
    }
  }, [question, questionTouched]);

  useEffect(() => {
    if (answerTouched) {
      const validation = validateCardAnswer(answer);
      setAnswerError(validation.isValid ? '' : validation.error || '');
    }
  }, [answer, answerTouched]);

  const handleSubmit = async () => {
    setQuestionTouched(true);
    setAnswerTouched(true);

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

    await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  const isFormValid =
    question.trim() !== '' && answer.trim() !== '' && !questionError && !answerError;

  return (
    <Modal
      title="Создать карточку"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Создать"
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
            onBlur={() => setQuestionTouched(true)}
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
            onBlur={() => setAnswerTouched(true)}
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
