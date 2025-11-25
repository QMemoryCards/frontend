import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {  Button } from 'antd';
import { DownloadOutlined, CheckOutlined } from '@ant-design/icons';
import { Spinner } from '@shared/ui';
import { useImportSharedDeck, useSharedDeck } from '@features/decks/model/useDecks.ts';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
`;

const Message = styled.p`
    font-size: 16px;
    color: #595959;
    margin: 0 0 24px 0;
    line-height: 1.5;
`;

const TokenContainer = styled.div`
    background: #f5f5f5;
    border-radius: 6px;
    padding: 16px;
    margin-top: 20px;
`;

const TokenLabel = styled.div`
    font-size: 14px;
    color: #8c8c8c;
    margin-bottom: 8px;
`;

const TokenValue = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    word-break: break-all;
    font-family: monospace;
`;

const DeckInfoContainer = styled.div`
    background: #e6f7ff;
    border-radius: 6px;
    padding: 16px;
    margin-top: 20px;
    text-align: left;
`;

const DeckInfoLabel = styled.div`
    font-size: 14px;
    color: #1890ff;
    margin-bottom: 8px;
    font-weight: 500;
`;

const DeckInfoValue = styled.div`
    font-size: 16px;
    color: #262626;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const ErrorContainer = styled.div`
    background: #fff2f0;
    border-radius: 6px;
    padding: 16px;
    margin-top: 20px;
    text-align: left;
`;

const ErrorText = styled.div`
    font-size: 14px;
    color: #ff4d4f;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
`;

const ImportButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SuccessContainer = styled.div`
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 6px;
    padding: 16px;
    margin-top: 20px;
    text-align: left;
`;

const SuccessText = styled.div`
    font-size: 14px;
    color: #52c41a;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const SharedDeckPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { deck, isLoading, error, fetchSharedDeck } = useSharedDeck();
  const { importDeck, isLoading: isImporting, importedDeck } = useImportSharedDeck();
  const [hasFetched, setHasFetched] = useState(false);
  // const { message } = App.useApp();

  useEffect(() => {
    if (token && !hasFetched) {
      setHasFetched(true);
      fetchSharedDeck(token).catch(err => {
        console.error('Error fetching shared deck:', err);
      });
    }
  }, [token, hasFetched, fetchSharedDeck]);

  const handleImport = async () => {
    if (!token) return;

    // Импортируем колоду с текущим названием и описанием
    const result = await importDeck(token, {
      newName: deck?.name ? `${deck.name} (импорт)` : undefined,
      description: deck?.description || undefined,
    });

    if (result) {
      navigate(`/decks/${result.id}/edit`);
    }
  };

  return (
    <Container>
      <Content>
        <SuccessIcon>✓</SuccessIcon>
        <Title>Общий доступ к колоде</Title>
        <Message>
          Вы просматриваете колоду, которой поделился другой пользователь.
        </Message>

        <TokenContainer>
          <TokenLabel>Токен доступа:</TokenLabel>
          <TokenValue>{token || 'Токен не найден'}</TokenValue>
        </TokenContainer>

        {isLoading && (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <ErrorText>Ошибка загрузки колоды: {error}</ErrorText>
          </ErrorContainer>
        )}

        {deck && (
          <>
            <DeckInfoContainer>
              <DeckInfoLabel>Название колоды:</DeckInfoLabel>
              <DeckInfoValue>{deck.name}</DeckInfoValue>

              {deck.description && (
                <>
                  <DeckInfoLabel style={{ marginTop: '16px' }}>Описание:</DeckInfoLabel>
                  <DeckInfoValue>{deck.description}</DeckInfoValue>
                </>
              )}

              <DeckInfoLabel style={{ marginTop: '16px' }}>Количество карточек:</DeckInfoLabel>
              <DeckInfoValue>{deck.cardCount}</DeckInfoValue>
            </DeckInfoContainer>

            <ActionButtons>
              <ImportButton
                type="primary"
                icon={<DownloadOutlined />}
                loading={isImporting}
                onClick={handleImport}
                disabled={!token}
              >
                Импортировать колоду
              </ImportButton>
            </ActionButtons>
          </>
        )}

        {importedDeck && (
          <SuccessContainer>
            <SuccessText>
              <CheckOutlined />
              Колода успешно импортирована!
            </SuccessText>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#52c41a' }}>
              Название: {importedDeck.name}
            </div>
          </SuccessContainer>
        )}
      </Content>
    </Container>
  );
};