import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { App, Button, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  PlusOutlined,
  SaveOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Input, Spinner } from '@shared/ui';
import type { Card, CreateCardRequest, UpdateCardRequest } from '@entities/card';
import { CardItem } from '@entities/card';
import { useGetDeck, useUpdateDeck } from '@features/decks';
import {
  CreateCardModal,
  EditCardModal,
  useCards,
  useCreateCard,
  useDeleteCard,
  useUpdateCard,
} from '@features/cards';
import { validateDeckDescription, validateDeckName } from '@shared/lib/validation';
import { VALIDATION } from '@shared/config';
import { useShareDeck } from '@features/decks/model/useDecks.ts';
import { Header as AppHeader } from '@widgets/Header';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
`;

const PageContent = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
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

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
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

const ShareButton = styled.button`
  background: #52c41a;
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
    background: #73d13d;
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

const ShareModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShareLinkInput = styled(Input)`
  flex: 1;
`;

const CopyButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DeckEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { modal, message } = App.useApp();

  const { deck, isLoading: deckLoading, fetchDeck } = useGetDeck();
  const { updateDeck, isLoading: updateLoading } = useUpdateDeck();
  const { cards, loading: cardsLoading, fetchCards, setCards } = useCards(id || '');
  const { createCard, loading: createLoading } = useCreateCard(id || '');
  const { updateCard, loading: updateCardLoading } = useUpdateCard(id || '');
  const { deleteCard } = useDeleteCard(id || '');
  const { shareDeck: shareDeckApi, isLoading: isGeneratingShare } = useShareDeck();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (id) {
      fetchDeck(id);
      fetchCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    await updateDeck(id, {
      name: name.trim(),
      description: description.trim() || undefined,
    });

    fetchDeck(id);
  };

  const handleGenerateShareLink = async () => {
    if (!id) return;

    const result = await shareDeckApi(id);
    if (result) {
      const shareLink = `${window.location.origin}/shared-deck/${result.token}`;
      setShareUrl(shareLink);
      setIsShareModalOpen(true);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    message.success('Ссылка скопирована в буфер обмена');
  };

  const handleCreateCard = async (data: CreateCardRequest) => {
    const newCard = await createCard(data);
    if (newCard) {
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      if (id) {
        await fetchDeck(id);
        await fetchCards();
      }
    }
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleUpdateCard = async (cardId: string, data: UpdateCardRequest) => {
    const updated = await updateCard(cardId, data);
    if (updated) {
      setCards(cards.map(c => (c.id === cardId ? updated : c)));
      setSelectedCard(null);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    modal.confirm({
      title: 'Удалить карточку?',
      content: 'Это действие нельзя отменить',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        const success = await deleteCard(cardId);
        if (success) {
          const updatedCards = cards.filter(c => c.id !== cardId);
          setCards(updatedCards);
          if (id) {
            await fetchDeck(id);
            await fetchCards();
          }
        }
      },
    });
  };

  const handleOpenCreateModal = () => {
    if (cards.length >= VALIDATION.CARD.MAX_CARDS) {
      message.warning(`Достигнут лимит карточек (${VALIDATION.CARD.MAX_CARDS})`);
      return;
    }
    setIsCreateModalOpen(true);
  };

  const isFormValid = name.trim() !== '' && !nameError && !descriptionError;

  if (deckLoading && !deck) {
    return (
      <>
        <AppHeader />
        <Container>
          <PageContent>
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          </PageContent>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <Container>
        <PageContent>
          <Content>
            <PageHeader>
              <BackButton onClick={() => navigate('/decks')}>
                <ArrowLeftOutlined />
                Назад
              </BackButton>
              <Title>Редактирование колоды</Title>
              <ActionButtons>
                <ShareButton onClick={handleGenerateShareLink} disabled={isGeneratingShare || !id}>
                  <ShareAltOutlined />
                  {isGeneratingShare ? 'Генерация...' : 'Поделиться'}
                </ShareButton>
                <SaveButton onClick={handleSave} disabled={!isFormValid || updateLoading}>
                  <SaveOutlined />
                  Сохранить
                </SaveButton>
              </ActionButtons>
            </PageHeader>

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
                  Карточки ({cards.length}/{VALIDATION.CARD.MAX_CARDS})
                </SectionTitle>
                <AddCardButton
                  onClick={handleOpenCreateModal}
                  disabled={cards.length >= VALIDATION.CARD.MAX_CARDS}
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

          <Modal
            title="Поделиться колодой"
            open={isShareModalOpen}
            onCancel={() => setIsShareModalOpen(false)}
            footer={[
              <Button key="close" onClick={() => setIsShareModalOpen(false)}>
                Закрыть
              </Button>,
              <CopyButton
                key="copy"
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopyToClipboard}
              >
                Копировать ссылку
              </CopyButton>,
            ]}
          >
            <ShareModalContainer>
              <p>Ссылка для общего доступа к колоде:</p>
              <ShareLinkInput value={shareUrl} readOnly placeholder="Ссылка для общего доступа" />
              <p style={{ fontSize: '12px', color: '#8c8c8c', margin: 0 }}>
                Любой, у кого есть эта ссылка, сможет просмотреть вашу колоду
              </p>
            </ShareModalContainer>
          </Modal>
        </PageContent>
      </Container>
    </>
  );
};
