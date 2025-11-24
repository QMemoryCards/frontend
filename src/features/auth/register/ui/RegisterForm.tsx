import React, { useState, useEffect } from 'react';
import { Input, Spinner } from '@shared/ui';
import { ROUTES } from '@shared/config';
import {
  validateEmail,
  validateLogin,
  validatePassword,
} from '@shared/lib/validation';
import { useRegister } from '../model/useRegister';
import {
  FormContainer,
  PasswordRequirements,
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
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Проверка отдельных требований к паролю для интерактивной валидации
  const passwordChecks = {
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

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

    await register({ email, login, password });
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
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => {
          setPasswordTouched(true);
          setPasswordFocused(false);
        }}
        error={passwordTouched ? passwordError : ''}
        helperText={!passwordTouched && !passwordFocused ? "Мин. 8 символов, заглавная буква, строчная, цифра, спецсимвол" : ""}
        disabled={isLoading}
        autoComplete="new-password"
      />

      {(passwordFocused || (passwordTouched && !passwordError)) && password && (
        <PasswordRequirements>
          <RequirementItem $isValid={passwordChecks.length}>
            {passwordChecks.length ? '✓' : '○'} 8-64 символа
          </RequirementItem>
          <RequirementItem $isValid={passwordChecks.uppercase}>
            {passwordChecks.uppercase ? '✓' : '○'} Заглавная буква (A-Z)
          </RequirementItem>
          <RequirementItem $isValid={passwordChecks.lowercase}>
            {passwordChecks.lowercase ? '✓' : '○'} Строчная буква (a-z)
          </RequirementItem>
          <RequirementItem $isValid={passwordChecks.number}>
            {passwordChecks.number ? '✓' : '○'} Цифра (0-9)
          </RequirementItem>
          <RequirementItem $isValid={passwordChecks.special}>
            {passwordChecks.special ? '✓' : '○'} Спецсимвол (!@#$%...)
          </RequirementItem>
        </PasswordRequirements>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton
        type="submit"
        disabled={!isFormValid || isLoading}
        $disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size={16} color="#ffffff" />
            Регистрация...
          </>
        ) : (
          'Зарегистрироваться'
        )}
      </SubmitButton>

      <LoginLink to={ROUTES.LOGIN}>Уже есть аккаунт? Войти</LoginLink>
    </FormContainer>
  );
};
