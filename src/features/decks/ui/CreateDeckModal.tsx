import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Input } from '@shared/ui';
import { validateDeckName, validateDeckDescription } from '@shared/lib/validation';
import type { CreateDeckRequest } from '@entities/deck';
import styled from 'styled-components';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeckRequest) => Promise<void>;
  isLoading: boolean;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

const TextArea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 10px 16px;
  font-size: 15px;
  font-family: inherit;
  border: 2px solid ${props => (props.$hasError ? '#ff4d4f' : '#d9d9d9')};
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;
  resize: vertical;

  &:focus {
    border-color: ${props => (props.$hasError ? '#ff4d4f' : '#1890ff')};
    box-shadow: 0 0 0 2px
      ${props => (props.$hasError ? 'rgba(255, 77, 79, 0.1)' : 'rgba(24, 144, 255, 0.1)')};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextAreaContainer = styled.div`
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

const HelperText = styled.span`
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.4;
`;

export const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setNameError('');
      setDescriptionError('');
      setNameTouched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (nameTouched) {
      const validation = validateDeckName(name);
      setNameError(validation.isValid ? '' : validation.error || '');
    }
  }, [name, nameTouched]);

  useEffect(() => {
    const validation = validateDeckDescription(description);
    setDescriptionError(validation.isValid ? '' : validation.error || '');
  }, [description]);

  const handleSubmit = async () => {
    setNameTouched(true);

    const nameValidation = validateDeckName(name);
    const descriptionValidation = validateDeckDescription(description);

    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || '');
      return;
    }

    if (!descriptionValidation.isValid) {
      setDescriptionError(descriptionValidation.error || '');
      return;
    }

    const trimmedDescription = description.trim();

    try {
      await onSubmit({
        name: name.trim(),
        description: trimmedDescription ? trimmedDescription : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

  const isFormValid = name.trim() !== '' && !nameError && !descriptionError;

  return (
    <Modal
      title="Создать новую колоду"
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
        <Input
          type="text"
          label="Название *"
          placeholder="Введите название колоды"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          error={nameTouched ? nameError : ''}
          disabled={isLoading}
          maxLength={90}
          helperText={`${name.length}/90`}
        />

        <TextAreaContainer>
          <Label>Описание</Label>
          <TextArea
            placeholder="Добавьте описание колоды (необязательно)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={isLoading}
            maxLength={200}
            $hasError={!!descriptionError}
          />
          {descriptionError ? (
            <ErrorText>{descriptionError}</ErrorText>
          ) : (
            <HelperText>{description.length}/200</HelperText>
          )}
        </TextAreaContainer>
      </FormContainer>
    </Modal>
  );
};
