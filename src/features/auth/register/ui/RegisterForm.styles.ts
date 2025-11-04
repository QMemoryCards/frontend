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
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: -12px;
`;

export const RequirementsTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #595959;
  margin: 0 0 8px 0;
`;

export const RequirementsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
`;

export const RequirementItem = styled.li`
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.6;
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
