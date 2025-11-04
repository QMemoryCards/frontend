import styled from 'styled-components';

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 48px 32px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
    border-radius: 16px;
  }

  @media (max-width: 360px) {
    padding: 32px 20px;
  }
`;

export const LogoContainer = styled.div`
  margin-bottom: 32px;

  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

export const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  font-weight: bold;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
    font-size: 32px;
    border-radius: 16px;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 28px;
  }

  @media (max-width: 360px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 48px 0;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 40px;
  }

  @media (max-width: 360px) {
    font-size: 14px;
    margin-bottom: 32px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;

  @media (max-width: 480px) {
    gap: 14px;
    max-width: 280px;
  }

  @media (max-width: 360px) {
    gap: 12px;
    max-width: 100%;
  }
`;
