import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DeckCard } from '@entities/deck';
import type { DeckDetails } from '@entities/deck';
import { useDecks, useCreateDeck, useDeleteDeck } from '@features/decks';
import { CreateDeckModal } from '@features/decks';
import { Spinner } from '@shared/ui';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchIcon = styled(SearchOutlined)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8c8c8c;
  font-size: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 10px 16px 10px 44px;
  font-size: 15px;
  border: 2px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  &::placeholder {
    color: #bfbfbf;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  height: 44px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: 2px solid ${props => (props.$active ? '#1890ff' : '#d9d9d9')};
  background-color: ${props => (props.$active ? '#e6f7ff' : '#ffffff')};
  color: ${props => (props.$active ? '#1890ff' : '#595959')};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const CreateButton = styled.button`
  height: 44px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background-color: #1890ff;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background-color: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  }

  &:active {
    background-color: #096dd9;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DecksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 24px 0;
`;

const Stats = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #8c8c8c;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #262626;
`;

type FilterStatus = 'all' | 'learned' | 'learning' | 'new';

export const DecksPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const { decks, isLoading, totalElements, refetch } = useDecks();
  const { createDeck: createDeckFn, isLoading: isCreating } = useCreateDeck();
  const { deleteDeck: deleteDeckFn } = useDeleteDeck();

  const filteredDecks = useMemo(() => {
    let filtered = decks;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        deck =>
          deck.name.toLowerCase().includes(query) || deck.description?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(deck => {
        if (filterStatus === 'learned') return deck.learnedPercent === 100;
        if (filterStatus === 'learning')
          return deck.learnedPercent > 0 && deck.learnedPercent < 100;
        if (filterStatus === 'new') return deck.learnedPercent === 0;
        return true;
      });
    }

    return filtered;
  }, [decks, searchQuery, filterStatus]);

  const handleCreateDeck = async (data: any) => {
    await createDeckFn(data);
    await refetch();
  };

  const handleDeleteDeck = (deckId: string) => {
    Modal.confirm({
      title: 'Удалить колоду?',
      content: 'Это действие нельзя отменить. Все карточки в колоде также будут удалены.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteDeckFn(deckId);
        await refetch();
      },
    });
  };

  const handleEditDeck = (deck: DeckDetails) => {
    navigate(`/decks/${deck.id}/edit`);
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size={48} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Мои колоды</Title>

        {decks.length > 0 && (
          <Stats>
            <StatItem>
              <StatLabel>Всего колод</StatLabel>
              <StatValue>{totalElements}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Изучено</StatLabel>
              <StatValue>{decks.filter(d => d.learnedPercent === 100).length}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>В процессе</StatLabel>
              <StatValue>
                {decks.filter(d => d.learnedPercent > 0 && d.learnedPercent < 100).length}
              </StatValue>
            </StatItem>
          </Stats>
        )}

        <Controls>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <FilterContainer>
            <FilterButton $active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>
              Все
            </FilterButton>
            <FilterButton $active={filterStatus === 'new'} onClick={() => setFilterStatus('new')}>
              Новые
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'learning'}
              onClick={() => setFilterStatus('learning')}
            >
              В изучении
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'learned'}
              onClick={() => setFilterStatus('learned')}
            >
              Изучено
            </FilterButton>
          </FilterContainer>

          <CreateButton onClick={() => setIsCreateModalOpen(true)}>
            <PlusOutlined />
            Создать колоду
          </CreateButton>
        </Controls>
      </Header>

      <Content>
        {filteredDecks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📚</EmptyIcon>
            <EmptyTitle>
              {decks.length === 0 ? 'У вас пока нет колод' : 'Ничего не найдено'}
            </EmptyTitle>
            <EmptyDescription>
              {decks.length === 0
                ? 'Создайте свою первую колоду, чтобы начать изучение'
                : 'Попробуйте изменить параметры поиска или фильтры'}
            </EmptyDescription>
            {decks.length === 0 && (
              <CreateButton onClick={() => setIsCreateModalOpen(true)}>
                <PlusOutlined />
                Создать первую колоду
              </CreateButton>
            )}
          </EmptyState>
        ) : (
          <DecksGrid>
            {filteredDecks.map(deck => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={handleEditDeck}
                onDelete={handleDeleteDeck}
              />
            ))}
          </DecksGrid>
        )}
      </Content>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDeck}
        isLoading={isCreating}
      />
    </Container>
  );
};
