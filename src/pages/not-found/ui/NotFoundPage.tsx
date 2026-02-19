import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Content = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.div`
  font-size: 120px;
  font-weight: 800;
  color: #f0f2f5;
  text-shadow: 4px 4px 0 #e8e8e8;
  line-height: 1;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Message = styled.p`
  font-size: 16px;
  color: #595959;
  margin: 0 0 40px 0;
  line-height: 1.6;
`;

const Illustration = styled.div`
  width: 200px;
  height: 150px;
  margin: 0 auto 40px;
  position: relative;

  &::before {
    content: '🚧';
    font-size: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: #f0f2f5;
    border-radius: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Button)`
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SecondaryButton = styled(Button)`
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Content>
        <ErrorCode>404</ErrorCode>
        <Illustration />
        <Title>Страница не найдена</Title>
        <Message>
          Запрашиваемая страница не существует или была перемещена.
          <br />
          Проверьте URL или вернитесь на предыдущую страницу.
        </Message>
        <ButtonGroup>
          <PrimaryButton type="primary" icon={<HomeOutlined />} onClick={handleGoHome} size="large">
            На главную
          </PrimaryButton>
          <SecondaryButton icon={<ArrowLeftOutlined />} onClick={handleGoBack} size="large">
            Назад
          </SecondaryButton>
        </ButtonGroup>
      </Content>
    </Container>
  );
};
