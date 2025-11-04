import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';
import { ROUTES } from '@shared/config';
import {
  WelcomeContainer,
  ContentWrapper,
  LogoContainer,
  Logo,
  Title,
  Subtitle,
  ButtonsContainer,
} from './WelcomePage.styles';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <WelcomeContainer>
      <ContentWrapper>
        <LogoContainer>
          <Logo>
            <img
              src="/logo.svg"
              alt="Flashcards logo"
              style={{
                width: '90%',
                height: '90%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Logo>
        </LogoContainer>

        <Title>Flashcards</Title>
        <Subtitle>Создавайте колоды карточек и учите всё что угодно быстро и эффективно</Subtitle>

        <ButtonsContainer>
          <Button variant="primary" fullWidth onClick={handleLoginClick}>
            Войти
          </Button>
          <Button variant="secondary" fullWidth onClick={handleRegisterClick}>
            Зарегистрироваться
          </Button>
        </ButtonsContainer>
      </ContentWrapper>
    </WelcomeContainer>
  );
};
