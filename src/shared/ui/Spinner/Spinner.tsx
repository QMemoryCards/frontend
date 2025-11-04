import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div<{ $size: number; $color: string }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${props => props.$color};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, color = '#1890ff' }) => {
  return (
    <SpinnerContainer>
      <StyledSpinner $size={size} $color={color} />
    </SpinnerContainer>
  );
};
