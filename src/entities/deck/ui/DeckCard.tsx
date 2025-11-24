import React from 'react';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { DeckDetails } from '../model/types';

interface DeckCardProps {
  deck: DeckDetails;
  onEdit: (deck: DeckDetails) => void;
  onDelete: (deckId: string) => void;
  onStudy?: (deckId: string) => void;
  onClick?: (deckId: string) => void;
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  flex: 1;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }

  &:last-child:hover {
    color: #ff4d4f;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 16px 0;
  line-height: 1.5;
  word-break: break-word;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background-color: ${props => {
    if (props.$percent === 0) return '#d9d9d9';
    if (props.$percent < 30) return '#ff4d4f';
    if (props.$percent < 70) return '#faad14';
    return '#52c41a';
  }};
  transition: width 0.3s ease;
`;

const LastStudied = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
`;

const StudyButton = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 16px;
  background: #1890ff;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
  }

  &:disabled {
    background: #d9d9d9;
    color: #8c8c8c;
    cursor: not-allowed;
  }
`;

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onEdit, onDelete, onStudy, onClick }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(deck);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(deck.id);
  };

  const handleStudy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStudy) {
      onStudy(deck.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(deck.id);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <Card onClick={handleClick}>
      <Header>
        <Title>{deck.name}</Title>
        <Actions>
          <IconButton onClick={handleEdit} aria-label="Редактировать">
            <EditOutlined />
          </IconButton>
          <IconButton onClick={handleDelete} aria-label="Удалить">
            <DeleteOutlined />
          </IconButton>
        </Actions>
      </Header>

      {deck.description && <Description>{deck.description}</Description>}

      <Stats>
        <StatItem>
          <StatLabel>Карточек</StatLabel>
          <StatValue>{deck.cardCount ?? 0}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Изучено</StatLabel>
          <StatValue>{deck.learnedPercent ?? 0}%</StatValue>
        </StatItem>
      </Stats>

      <ProgressBar>
        <ProgressFill $percent={deck.learnedPercent} />
      </ProgressBar>

      <LastStudied>Последнее изучение: {formatDate(deck.lastStudied)}</LastStudied>

      <StudyButton onClick={handleStudy} disabled={deck.cardCount === 0}>
        <PlayCircleOutlined />
        {deck.cardCount === 0 ? 'Нет карточек' : 'Изучить'}
      </StudyButton>
    </Card>
  );
};
