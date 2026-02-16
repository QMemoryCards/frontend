import React from 'react';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Card } from '../model/types';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const QuestionText = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
  word-break: break-word;
`;

const AnswerText = styled.div`
  font-size: 14px;
  color: #8c8c8c;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 16px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background: #f5f5f5;
    color: #1890ff;
  }

  &:last-child:hover {
    color: #ff4d4f;
  }
`;

export const CardItem: React.FC<CardItemProps> = ({ card, onEdit, onDelete }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(card);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card.id);
  };

  return (
    <CardContainer>
      <CardContent>
        <QuestionText>{card.question}</QuestionText>
        <AnswerText>{card.answer}</AnswerText>
      </CardContent>
      <Actions>
        <IconButton onClick={handleEdit} aria-label="Редактировать">
          <EditOutlined />
        </IconButton>
        <IconButton onClick={handleDelete} aria-label="Удалить">
          <DeleteOutlined />
        </IconButton>
      </Actions>
    </CardContainer>
  );
};
