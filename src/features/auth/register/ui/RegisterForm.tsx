import React, { useState, useEffect } from 'react';
import { Input } from '@shared/ui';
import { ROUTES } from '@shared/config';
import {
  validateEmail,
  validateLogin,
  validatePassword,
  getPasswordRequirements,
} from '@shared/lib/validation';
import { useRegister } from '../model/useRegister';
import {
  FormContainer,
  PasswordRequirements,
  RequirementsTitle,
  RequirementsList,
  RequirementItem,
  SubmitButton,
  ErrorMessage,
  LoginLink,
} from './RegisterForm.styles';

export const RegisterForm: React.FC = () => {
  const { register, isLoading, error } = useRegister();

  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [loginTouched, setLoginTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    if (emailTouched && email) {
      const validation = validateEmail(email);
      setEmailError(validation.isValid ? '' : validation.error || '');
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (loginTouched && login) {
      const validation = validateLogin(login);
      setLoginError(validation.isValid ? '' : validation.error || '');
    }
  }, [login, loginTouched]);

  useEffect(() => {
    if (passwordTouched && password) {
      const validation = validatePassword(password);
      setPasswordError(validation.isValid ? '' : validation.error || '');
    }
  }, [password, passwordTouched]);

  const isFormValid =
    email.trim() !== '' &&
    login.trim() !== '' &&
    password.trim() !== '' &&
    !emailError &&
    !loginError &&
    !passwordError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailTouched(true);
    setLoginTouched(true);
    setPasswordTouched(true);

    const emailValidation = validateEmail(email);
    const loginValidation = validateLogin(login);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation.isValid ? '' : emailValidation.error || '');
    setLoginError(loginValidation.isValid ? '' : loginValidation.error || '');
    setPasswordError(passwordValidation.isValid ? '' : passwordValidation.error || '');

    if (!emailValidation.isValid || !loginValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    try {
      await register({ email, login, password });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="email"
        label="Email *"
        placeholder="example@mail.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={() => setEmailTouched(true)}
        error={emailTouched ? emailError : ''}
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        type="text"
        label="Логин *"
        placeholder="username"
        value={login}
        onChange={e => setLogin(e.target.value)}
        onBlur={() => setLoginTouched(true)}
        error={loginTouched ? loginError : ''}
        helperText="От 3 до 64 символов. Латиница, цифры и символы -._"
        disabled={isLoading}
        autoComplete="username"
      />

      <Input
        type="password"
        label="Пароль *"
        placeholder="Введите пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onBlur={() => setPasswordTouched(true)}
        error={passwordTouched ? passwordError : ''}
        disabled={isLoading}
        autoComplete="new-password"
      />

      <PasswordRequirements>
        <RequirementsTitle>Требования к паролю:</RequirementsTitle>
        <RequirementsList>
          {getPasswordRequirements().map((req, index) => (
            <RequirementItem key={index}>{req}</RequirementItem>
          ))}
        </RequirementsList>
      </PasswordRequirements>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton
        type="submit"
        disabled={!isFormValid || isLoading}
        $disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </SubmitButton>

      <LoginLink to={ROUTES.LOGIN}>Уже есть аккаунт? Войти</LoginLink>
    </FormContainer>
  );
};
