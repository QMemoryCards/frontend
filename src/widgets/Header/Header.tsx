import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/config';

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  @media (max-width: 768px) {
    height: 56px;
  }
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  cursor: pointer;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: ${props => (props.$active ? '#1890ff' : '#595959')};
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;

  &:hover {
    color: #1890ff;
    background: #e6f7ff;
  }

  ${props =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 16px;
      right: 16px;
      height: 2px;
      background: #1890ff;
    }
  `}

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 6px 12px;
  }
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
  background: #ffffff;
  color: #595959;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDecksPage = location.pathname === ROUTES.DECKS || location.pathname.startsWith('/decks');

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => handleNavigate(ROUTES.DECKS)}>Учебные карточки</Logo>
        <Nav>
          <NavButton $active={isDecksPage} onClick={() => handleNavigate(ROUTES.DECKS)}>
            Колоды
          </NavButton>
          <ProfileButton onClick={() => handleNavigate(ROUTES.PROFILE)} aria-label="Профиль">
            <UserOutlined />
          </ProfileButton>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};
