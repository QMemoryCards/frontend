import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
`;

const Content = styled.div`
  padding: 40px;
  background: white;
  border-radius: 8px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

const Message = styled.p`
  font-size: 16px;
  color: #8c8c8c;
  margin: 0;
`;

export const DecksPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <Title>🎉 Вы успешно вошли!</Title>
        <Message>Страница управления колодами в разработке...</Message>
      </Content>
    </Container>
  );
};
