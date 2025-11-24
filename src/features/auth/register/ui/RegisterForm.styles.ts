import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

export const PasswordRequirements = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
  margin-top: -12px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const RequirementItem = styled.div<{ $isValid: boolean }>`
  font-size: 13px;
  color: ${props => (props.$isValid ? '#52c41a' : '#8c8c8c')};
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s ease;
  font-weight: ${props => (props.$isValid ? '500' : '400')};

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    flex-shrink: 0;
  }
`;

export const SubmitButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  height: 48px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  background-color: ${props => (props.$disabled ? '#d9d9d9' : '#1890ff')};
  color: #ffffff;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background-color: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  }

  &:active:not(:disabled) {
    background-color: #096dd9;
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  padding: 12px 16px;
  color: #cf1322;
  font-size: 14px;
  line-height: 1.5;
`;

export const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  color: #1890ff;
  font-size: 14px;
  margin-top: 16px;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
`;
