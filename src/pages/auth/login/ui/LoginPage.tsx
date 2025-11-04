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
`;

export const LoginPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Страница входа</h1>
        <p>В разработке...</p>
      </Content>
    </Container>
  );
};
