import React, { useEffect, useState } from 'react';
import { Input, Spinner } from '@shared/ui';
import { ROUTES } from '@shared/config';
import { validateLogin, validatePassword } from '@shared/lib/validation';
import { useLogin } from '../model/useLogin';
import { ErrorMessage, FormContainer, RegisterLink, SubmitButton } from './LoginForm.styles';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useLogin();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');

  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loginTouched, setLoginTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    if (loginTouched && loginValue) {
      const validation = validateLogin(loginValue);
      setLoginError(validation.isValid ? '' : validation.error || '');
    }
  }, [loginValue, loginTouched]);

  useEffect(() => {
    if (passwordTouched && password) {
      const validation = validatePassword(password);
      setPasswordError(validation.isValid ? '' : validation.error || '');
    }
  }, [password, passwordTouched]);

  const isFormFilled = loginValue.trim() !== '' && password.trim() !== '';

  const isFormValid = isFormFilled && !loginError && !passwordError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginTouched(true);
    setPasswordTouched(true);

    const loginValidation = validateLogin(loginValue);
    const passwordValidation = validatePassword(password);

    setLoginError(loginValidation.isValid ? '' : loginValidation.error || '');
    setPasswordError(passwordValidation.isValid ? '' : passwordValidation.error || '');

    if (!loginValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    await login({ login: loginValue, password });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        label="Логин *"
        placeholder="Введите логин"
        value={loginValue}
        onChange={e => setLoginValue(e.target.value)}
        onBlur={() => setLoginTouched(true)}
        error={loginTouched ? loginError : ''}
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
        autoComplete="current-password"
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton
        type="submit"
        disabled={!isFormValid || isLoading}
        $disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size={16} color="#ffffff" />
            Вход...
          </>
        ) : (
          'Войти'
        )}
      </SubmitButton>

      <RegisterLink to={ROUTES.REGISTER}>Нет аккаунта? Зарегистрироваться</RegisterLink>
    </FormContainer>
  );
};
