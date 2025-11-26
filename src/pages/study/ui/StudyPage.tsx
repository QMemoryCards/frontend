import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { App, Progress } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useStudy, StudyCard } from '@features/study';
import { useGetDeck } from '@features/decks';
import { Spinner } from '@shared/ui';
import { ROUTES } from '@shared/config';
import { Header as AppHeader } from '@widgets/Header';

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Container = styled.div`
  flex: 1;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 12px 24px 20px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 8px 16px 16px;
  }
`;

const ProgressSection = styled.div`
  flex-shrink: 0;
  margin-bottom: 12px;
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const BackIcon = styled(ArrowLeftOutlined)`
  font-size: 18px;
  color: #595959;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    background: #e6e6e6;
    color: #262626;
  }
`;

const DeckName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const CardCounter = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #595959;
`;

const ProgressPercent = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
`;

const CardSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const ButtonsSection = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const AnswerButton = styled.button<{ $variant: 'remember' | 'forget' }>`
  flex: 1;
  max-width: 240px;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  ${props =>
    props.$variant === 'remember'
      ? `
    background: #52c41a;
    color: #ffffff;
    &:hover {
      background: #73d13d;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
    }
  `
      : `
    background: #ff4d4f;
    color: #ffffff;
    &:hover {
      background: #ff7875;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
    }
  `}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 44px;
  }
`;

const ShowAnswerButton = styled.button`
  flex: 1;
  max-width: 320px;
  height: 48px;
  background: #1890ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 44px;
  }
`;

const ResultsContainer = styled.div`
  text-align: center;
  padding: 48px 24px;
`;

const ResultsTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-width: 200px;
`;

const StatValue = styled.div<{ $color: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.$color};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #8c8c8c;
`;

const ResultButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ResultButton = styled.button<{ $primary?: boolean }>`
  height: 48px;
  padding: 0 32px;
  border: ${props => (props.$primary ? 'none' : '2px solid #d9d9d9')};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  ${props =>
    props.$primary
      ? `
    background: #1890ff;
    color: #ffffff;
    &:hover {
      background: #40a9ff;
    }
  `
      : `
    background: #ffffff;
    color: #262626;
    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  `}
`;

export const StudyPage: React.FC = () => {
  const { id: deckId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { modal } = App.useApp();

  const { deck, fetchDeck } = useGetDeck();
  const {
    cards,
    loading,
    currentCardIndex,
    showAnswer,
    rememberedCount,
    forgottenCount,
    isCompleted,
    progress,
    fetchStudyCards,
    submitAnswer,
    toggleAnswer,
  } = useStudy(deckId!);

  useEffect(() => {
    if (deckId) {
      fetchDeck(deckId);
      fetchStudyCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  const handleNavigation = (path: string) => {
    if (!isCompleted) {
      modal.confirm({
        title: 'Завершить обучение?',
        content: 'Ваш прогресс будет сохранен.',
        okText: 'Завершить',
        cancelText: 'Отмена',
        onOk: () => {
          navigate(path);
        },
      });
    } else {
      navigate(path);
    }
  };

  const handleBack = () => {
    modal.confirm({
      title: 'Завершить обучение?',
      content: 'Ваш прогресс будет сохранен.',
      okText: 'Завершить',
      cancelText: 'Отмена',
      onOk: () => {
        navigate(ROUTES.DECKS);
      },
    });
  };

  const handleRemembered = () => {
    submitAnswer('remembered');
  };

  const handleForgotten = () => {
    submitAnswer('forgotten');
  };

  const handleRepeat = () => {
    fetchStudyCards();
  };

  const handleBackToDecks = () => {
    navigate(ROUTES.DECKS);
  };

  if (loading && cards.length === 0) {
    return (
      <PageWrapper>
        <Container>
          <Spinner />
        </Container>
      </PageWrapper>
    );
  }

  if (cards.length === 0 && !loading) {
    return (
      <PageWrapper>
        <AppHeader onNavigate={handleNavigation} />
        <Container>
          <Content>
            <ResultsContainer>
              <ResultsTitle>В этой колоде пока нет карточек</ResultsTitle>
              <ResultButton onClick={() => navigate(ROUTES.DECKS)}>
                Вернуться к колодам
              </ResultButton>
            </ResultsContainer>
          </Content>
        </Container>
      </PageWrapper>
    );
  }

  if (isCompleted) {
    const totalCards = rememberedCount + forgottenCount;
    const learnedPercent = Math.round((rememberedCount / totalCards) * 100);

    return (
      <PageWrapper>
        <AppHeader onNavigate={handleNavigation} />
        <Container>
          <Content>
            <ResultsContainer>
              <ResultsTitle>Отличная работа!</ResultsTitle>
              <Stats>
                <StatCard>
                  <StatValue $color="#52c41a">{rememberedCount}</StatValue>
                  <StatLabel>Помню</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue $color="#ff4d4f">{forgottenCount}</StatValue>
                  <StatLabel>Не помню</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue $color="#1890ff">{learnedPercent}%</StatValue>
                  <StatLabel>Прогресс</StatLabel>
                </StatCard>
              </Stats>
              <ResultButtons>
                <ResultButton $primary onClick={handleRepeat}>
                  Повторить снова
                </ResultButton>
                <ResultButton onClick={handleBackToDecks}>Вернуться к колодам</ResultButton>
              </ResultButtons>
            </ResultsContainer>
          </Content>
        </Container>
      </PageWrapper>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <PageWrapper>
      <AppHeader onNavigate={handleNavigation} />
      <Container>
        <Content>
          <ProgressSection>
            <ProgressHeader>
              <BackIcon onClick={handleBack} />
              <DeckName>{deck?.name || 'Обучение'}</DeckName>
            </ProgressHeader>
            <ProgressInfo>
              <CardCounter>
                Карточка {currentCardIndex + 1} из {cards.length}
              </CardCounter>
              <ProgressPercent>{progress}%</ProgressPercent>
            </ProgressInfo>
            <Progress percent={progress} showInfo={false} strokeColor="#1890ff" />
          </ProgressSection>

          <CardSection>
            {currentCard && (
              <StudyCard
                question={currentCard.question}
                answer={currentCard.answer}
                showAnswer={showAnswer}
                onToggleAnswer={toggleAnswer}
              />
            )}
          </CardSection>

          <ButtonsSection>
            {!showAnswer ? (
              <ShowAnswerButton onClick={toggleAnswer}>Показать ответ</ShowAnswerButton>
            ) : (
              <>
                <AnswerButton $variant="forget" onClick={handleForgotten}>
                  <CloseOutlined />
                  Не помню
                </AnswerButton>
                <AnswerButton $variant="remember" onClick={handleRemembered}>
                  <CheckOutlined />
                  Помню
                </AnswerButton>
              </>
            )}
          </ButtonsSection>
        </Content>
      </Container>
    </PageWrapper>
  );
};
