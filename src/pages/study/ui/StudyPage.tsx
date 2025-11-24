import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { App, Progress } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useStudy, StudyCard } from '@features/study';
import { Spinner } from '@shared/ui';
import { ROUTES } from '@shared/config';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #ffffff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: #f0f0f0;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 32px;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CardCounter = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
`;

const ProgressPercent = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
`;

const CardSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const ButtonsSection = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AnswerButton = styled.button<{ $variant: 'remember' | 'forget' }>`
  flex: 1;
  max-width: 280px;
  height: 56px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;

  ${props =>
    props.$variant === 'remember'
      ? `
    background: #52c41a;
    color: #ffffff;
    &:hover {
      background: #73d13d;
    }
  `
      : `
    background: #ff4d4f;
    color: #ffffff;
    &:hover {
      background: #ff7875;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ShowAnswerButton = styled.button`
  flex: 1;
  max-width: 400px;
  height: 56px;
  background: #1890ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
  }

  @media (max-width: 768px) {
    max-width: 100%;
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
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { modal } = App.useApp();

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
      fetchStudyCards();
    }
  }, [deckId]);

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
      <Container>
        <Spinner />
      </Container>
    );
  }

  if (cards.length === 0 && !loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(ROUTES.DECKS)}>
            <ArrowLeftOutlined />
            Назад
          </BackButton>
        </Header>
        <Content>
          <ResultsContainer>
            <ResultsTitle>В этой колоде пока нет карточек</ResultsTitle>
            <ResultButton onClick={() => navigate(ROUTES.DECKS)}>Вернуться к колодам</ResultButton>
          </ResultsContainer>
        </Content>
      </Container>
    );
  }

  if (isCompleted) {
    const totalCards = rememberedCount + forgottenCount;
    const learnedPercent = Math.round((rememberedCount / totalCards) * 100);

    return (
      <Container>
        <Header>
          <BackButton onClick={handleBackToDecks}>
            <ArrowLeftOutlined />
            Назад
          </BackButton>
          <Title>Обучение завершено</Title>
        </Header>
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
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeftOutlined />
          Завершить
        </BackButton>
        <Title>Обучение</Title>
      </Header>
      <Content>
        <ProgressSection>
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
  );
};
