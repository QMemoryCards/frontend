import React from 'react';
import styled from 'styled-components';
import { LoginForm } from '@features/auth/login';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 480px;

  @media (max-width: 768px) {
    padding: 40px 32px;
  }

  @media (max-width: 480px) {
    padding: 32px 24px;
    border-radius: 12px;
  }

  @media (max-width: 360px) {
    padding: 24px 20px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #8c8c8c;
  margin: 0 0 32px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

export const LoginPage: React.FC = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>Вход</Title>
        <Subtitle>Войдите в свой аккаунт для продолжения</Subtitle>
        <LoginForm />
      </ContentWrapper>
    </Container>
  );
};
