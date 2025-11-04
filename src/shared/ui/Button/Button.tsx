import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{ $variant: 'primary' | 'secondary'; $fullWidth: boolean }>`
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  min-width: 200px;
  height: 48px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props =>
    props.$variant === 'primary' &&
    `
    background-color: #1890ff;
    color: #ffffff;
    
    &:hover:not(:disabled) {
      background-color: #40a9ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
    
    &:active:not(:disabled) {
      background-color: #096dd9;
      transform: translateY(0);
    }
  `}

  ${props =>
    props.$variant === 'secondary' &&
    `
    background-color: #ffffff;
    color: #1890ff;
    border: 2px solid #1890ff;
    
    &:hover:not(:disabled) {
      background-color: #e6f7ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
    }
    
    &:active:not(:disabled) {
      background-color: #bae7ff;
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-width: 160px;
    height: 44px;
    font-size: 15px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      $variant={variant}
      $fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};
