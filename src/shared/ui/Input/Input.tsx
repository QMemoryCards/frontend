import React, { InputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #262626;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  height: 44px;
  padding: 10px 16px;
  font-size: 15px;
  border: 2px solid ${props => (props.$hasError ? '#ff4d4f' : '#d9d9d9')};
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: ${props => (props.$hasError ? '#ff4d4f' : '#1890ff')};
    box-shadow: 0 0 0 2px
      ${props => (props.$hasError ? 'rgba(255, 77, 79, 0.1)' : 'rgba(24, 144, 255, 0.1)')};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &[type='password'] {
    padding-right: 48px;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.3s;

  &:hover {
    color: #262626;
  }
`;

const ErrorText = styled.span`
  font-size: 13px;
  color: #ff4d4f;
  line-height: 1.4;
`;

const HelperText = styled.span`
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.4;
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        <StyledInput type={inputType} $hasError={!!error} {...props} />
        {isPasswordType && (
          <IconButton
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </IconButton>
        )}
      </InputWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
};
