import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Modal, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Input } from '@shared/ui';
import { CardItem } from '@entities/card';
import type { Card } from '@entities/card';
import { useGetDeck, useUpdateDeck } from '@features/decks';
import { useCards, useCreateCard, useUpdateCard, useDeleteCard } from '@features/cards';
import { CreateCardModal, EditCardModal } from '@features/cards';
import { validateDeckName, validateDeckDescription } from '@shared/lib/validation';
import { VALIDATION } from '@shared/config';
import { Spinner } from '@shared/ui';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #262626;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const SaveButton = styled.button`
  background: #1890ff;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;

const DeckInfoSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const FieldContainer = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 13px;
  color: #ff4d4f;
  margin-top: 4px;
`;

const CharCounter = styled.span<{ $isError: boolean }>`
  display: block;
  font-size: 13px;
  color: ${props => (props.$isError ? '#ff4d4f' : '#8c8c8c')};
  margin-top: 4px;
  text-align: right;
`;

const CardsSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const AddCardButton = styled.button`
  background: #1890ff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #8c8c8c;
  font-size: 15px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const DeckEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { deck, loading: deckLoading, fetchDeck } = useGetDeck();
  const { updateDeck, loading: updateLoading } = useUpdateDeck();
  const { cards, loading: cardsLoading, totalElements, fetchCards, setCards } = useCards(id || '');
  const { createCard, loading: createLoading } = useCreateCard(id || '');
  const { updateCard, loading: updateCardLoading } = useUpdateCard(id || '');
  const { deleteCard, loading: deleteLoading } = useDeleteCard(id || '');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (id) {
      fetchDeck(id);
      fetchCards();
    }
  }, [id]);

  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setDescription(deck.description || '');
    }
  }, [deck]);

  useEffect(() => {
    const validation = validateDeckName(name);
    setNameError(validation.isValid ? '' : validation.error || '');
  }, [name]);

  useEffect(() => {
    const validation = validateDeckDescription(description);
    setDescriptionError(validation.isValid ? '' : validation.error || '');
  }, [description]);

  const handleSave = async () => {
    if (!id || !deck) return;

    const nameValidation = validateDeckName(name);
    const descriptionValidation = validateDeckDescription(description);

    if (!nameValidation.isValid || !descriptionValidation.isValid) {
      return;
    }

    const updated = await updateDeck(id, {
      name: name.trim(),
      description: description.trim() || undefined,
    });

    if (updated) {
      fetchDeck(id);
    }
  };

  const handleCreateCard = async (data: any) => {
    const newCard = await createCard(data);
    if (newCard) {
      setCards([...cards, newCard]);
      setIsCreateModalOpen(false);
    }
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleUpdateCard = async (cardId: string, data: any) => {
    const updated = await updateCard(cardId, data);
    if (updated) {
      setCards(cards.map(c => (c.id === cardId ? updated : c)));
      setIsEditModalOpen(false);
      setSelectedCard(null);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    Modal.confirm({
      title: 'Удалить карточку?',
      content: 'Это действие нельзя отменить',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        const success = await deleteCard(cardId);
        if (success) {
          setCards(cards.filter(c => c.id !== cardId));
        }
      },
    });
  };

  const handleOpenCreateModal = () => {
    if (totalElements >= VALIDATION.CARD.MAX_CARDS) {
      message.warning(`Достигнут лимит карточек (${VALIDATION.CARD.MAX_CARDS})`);
      return;
    }
    setIsCreateModalOpen(true);
  };

  const isFormValid = name.trim() !== '' && !nameError && !descriptionError;

  if (deckLoading && !deck) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <BackButton onClick={() => navigate('/decks')}>
            <ArrowLeftOutlined />
            Назад
          </BackButton>
          <Title>Редактирование колоды</Title>
          <SaveButton onClick={handleSave} disabled={!isFormValid || updateLoading}>
            <SaveOutlined />
            Сохранить
          </SaveButton>
        </Header>

        <DeckInfoSection>
          <FieldContainer>
            <Label>Название</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введите название колоды"
              disabled={updateLoading}
            />
            {nameError ? (
              <ErrorText>{nameError}</ErrorText>
            ) : (
              <CharCounter $isError={name.length > VALIDATION.DECK.NAME_MAX}>
                {name.length}/{VALIDATION.DECK.NAME_MAX}
              </CharCounter>
            )}
          </FieldContainer>

          <FieldContainer>
            <Label>Описание</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Введите описание (необязательно)"
              disabled={updateLoading}
            />
            {descriptionError ? (
              <ErrorText>{descriptionError}</ErrorText>
            ) : (
              <CharCounter $isError={description.length > VALIDATION.DECK.DESCRIPTION_MAX}>
                {description.length}/{VALIDATION.DECK.DESCRIPTION_MAX}
              </CharCounter>
            )}
          </FieldContainer>
        </DeckInfoSection>

        <CardsSection>
          <SectionHeader>
            <SectionTitle>
              Карточки ({totalElements}/{VALIDATION.CARD.MAX_CARDS})
            </SectionTitle>
            <AddCardButton
              onClick={handleOpenCreateModal}
              disabled={totalElements >= VALIDATION.CARD.MAX_CARDS}
            >
              <PlusOutlined />
              Добавить карточку
            </AddCardButton>
          </SectionHeader>

          {cardsLoading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : cards.length === 0 ? (
            <EmptyState>
              Карточек пока нет. Создайте первую карточку для начала обучения.
            </EmptyState>
          ) : (
            <CardsList>
              {cards.map(card => (
                <CardItem
                  key={card.id}
                  card={card}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                />
              ))}
            </CardsList>
          )}
        </CardsSection>
      </Content>

      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCard}
        isLoading={createLoading}
      />

      <EditCardModal
        isOpen={isEditModalOpen}
        card={selectedCard}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCard(null);
        }}
        onSubmit={handleUpdateCard}
        isLoading={updateCardLoading}
      />
    </Container>
  );
};
