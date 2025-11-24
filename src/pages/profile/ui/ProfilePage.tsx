import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { App } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  KeyOutlined,
  LogoutOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Input } from '@shared/ui';
import { useGetUser, useUpdateUser, useChangePassword, useDeleteUser } from '@features/profile';
import { logoutUser } from '@entities/user';
import { validateEmail, validateLogin, validatePassword } from '@shared/lib/validation';
import { VALIDATION } from '@shared/config';
import { Spinner } from '@shared/ui';

const Container = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #262626;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 20px 0;
`;

const FieldContainer = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 8px;
`;

const ReadOnlyValue = styled.div`
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  color: #262626;
`;

const ErrorText = styled.span`
  display: block;
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

const CharCounter = styled.span<{ $isError: boolean }>`
  display: block;
  font-size: 12px;
  color: ${props => (props.$isError ? '#ff4d4f' : '#8c8c8c')};
  margin-top: 4px;
  text-align: right;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #1890ff;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #40a9ff;
  }
`;

const SecondaryButton = styled(Button)`
  background: #ffffff;
  color: #262626;
  border: 1px solid #d9d9d9;

  &:hover:not(:disabled) {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const DangerButton = styled(Button)`
  background: #ff4d4f;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #ff7875;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { modal, message: messageApi } = App.useApp();

  const { user, setUser, loading: userLoading, fetchUser } = useGetUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { changePassword, loading: passwordLoading } = useChangePassword();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setLogin(user.login);
    }
  }, [user]);

  useEffect(() => {
    if (editMode) {
      const validation = validateEmail(email);
      setEmailError(validation.isValid ? '' : validation.error || '');
    }
  }, [email, editMode]);

  useEffect(() => {
    if (editMode) {
      const validation = validateLogin(login);
      setLoginError(validation.isValid ? '' : validation.error || '');
    }
  }, [login, editMode]);

  useEffect(() => {
    if (passwordMode) {
      const validation = validatePassword(currentPassword);
      setCurrentPasswordError(validation.isValid ? '' : validation.error || '');
    }
  }, [currentPassword, passwordMode]);

  useEffect(() => {
    if (passwordMode) {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        setNewPasswordError(validation.error || '');
      } else if (newPassword === currentPassword) {
        setNewPasswordError('Новый пароль не должен совпадать со старым');
      } else {
        setNewPasswordError('');
      }
    }
  }, [newPassword, currentPassword, passwordMode]);

  const handleSaveProfile = async () => {
    if (!user) return;

    const emailValidation = validateEmail(email);
    const loginValidation = validateLogin(login);

    if (!emailValidation.isValid || !loginValidation.isValid) {
      return;
    }

    const updatedUser = await updateUser({ email, login });
    if (updatedUser) {
      setUser(updatedUser);
      messageApi.success('Данные успешно обновлены');
      setEditMode(false);
    }
  };

  const handleChangePassword = async () => {
    const currentValidation = validatePassword(currentPassword);
    const newValidation = validatePassword(newPassword);

    if (!currentValidation.isValid || !newValidation.isValid || newPassword === currentPassword) {
      return;
    }

    const result = await changePassword({ currentPassword, newPassword });
    if (result.success) {
      messageApi.success('Пароль успешно изменен');
      setPasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
      setCurrentPasswordError('');
      setNewPasswordError('');
    } else if (result.statusCode === 403) {
      setCurrentPasswordError('Неверный текущий пароль');
    } else {
      messageApi.error(result.message || 'Ошибка при изменении пароля');
    }
  };

  const handleLogout = () => {
    modal.confirm({
      title: 'Выйти из аккаунта?',
      content: 'Вы уверены, что хотите выйти?',
      okText: 'Выйти',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await logoutUser();
          navigate('/');
        } catch {
          messageApi.error('Ошибка при выходе');
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    modal.confirm({
      title: 'Удалить аккаунт?',
      content: 'Это действие необратимо. Все ваши данные будут безвозвратно удалены.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        const success = await deleteUser();
        if (success) {
          messageApi.success('Аккаунт успешно удален');
          navigate('/');
        }
      },
    });
  };

  if (userLoading && !user) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </Container>
    );
  }

  const isProfileFormValid =
    email.trim() !== '' && login.trim() !== '' && !emailError && !loginError;
  const isPasswordFormValid =
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    !currentPasswordError &&
    !newPasswordError;

  return (
    <Container>
      <Content>
        <Header>
          <BackButton onClick={() => navigate('/decks')}>
            <ArrowLeftOutlined />
            Назад
          </BackButton>
          <Title>Управление аккаунтом</Title>
        </Header>

        <Section>
          <SectionTitle>Личные данные</SectionTitle>

          {!editMode && !passwordMode ? (
            <>
              <FieldContainer>
                <Label>Email</Label>
                <ReadOnlyValue>{user?.email}</ReadOnlyValue>
              </FieldContainer>

              <FieldContainer>
                <Label>Логин</Label>
                <ReadOnlyValue>{user?.login}</ReadOnlyValue>
              </FieldContainer>

              <FieldContainer>
                <Label>Пароль</Label>
                <ReadOnlyValue>••••••••</ReadOnlyValue>
              </FieldContainer>

              <ButtonGroup>
                <SecondaryButton onClick={() => setEditMode(true)}>
                  <EditOutlined />
                  Изменить данные
                </SecondaryButton>
                <SecondaryButton onClick={() => setPasswordMode(true)}>
                  <KeyOutlined />
                  Изменить пароль
                </SecondaryButton>
              </ButtonGroup>
            </>
          ) : editMode ? (
            <>
              <FieldContainer>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  disabled={updateLoading}
                />
                {emailError ? (
                  <ErrorText>{emailError}</ErrorText>
                ) : (
                  <CharCounter $isError={email.length > VALIDATION.USER.EMAIL_MAX}>
                    {email.length}/{VALIDATION.USER.EMAIL_MAX}
                  </CharCounter>
                )}
              </FieldContainer>

              <FieldContainer>
                <Label>Логин</Label>
                <Input
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  placeholder="username"
                  disabled={updateLoading}
                />
                {loginError ? (
                  <ErrorText>{loginError}</ErrorText>
                ) : (
                  <CharCounter $isError={login.length > VALIDATION.USER.LOGIN_MAX}>
                    {login.length}/{VALIDATION.USER.LOGIN_MAX}
                  </CharCounter>
                )}
              </FieldContainer>

              <ButtonGroup>
                <PrimaryButton
                  onClick={handleSaveProfile}
                  disabled={!isProfileFormValid || updateLoading}
                >
                  Сохранить изменения
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setEditMode(false);
                    setEmail(user?.email || '');
                    setLogin(user?.login || '');
                  }}
                  disabled={updateLoading}
                >
                  Отмена
                </SecondaryButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <FieldContainer>
                <Label>Текущий пароль</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                  disabled={passwordLoading}
                />
                {currentPasswordError && <ErrorText>{currentPasswordError}</ErrorText>}
              </FieldContainer>

              <FieldContainer>
                <Label>Новый пароль</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  disabled={passwordLoading}
                />
                {newPasswordError ? (
                  <ErrorText>{newPasswordError}</ErrorText>
                ) : (
                  <CharCounter $isError={newPassword.length > VALIDATION.USER.PASSWORD_MAX}>
                    {newPassword.length}/{VALIDATION.USER.PASSWORD_MAX}
                  </CharCounter>
                )}
              </FieldContainer>

              <ButtonGroup>
                <PrimaryButton
                  onClick={handleChangePassword}
                  disabled={!isPasswordFormValid || passwordLoading}
                >
                  Изменить пароль
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setPasswordMode(false);
                    setCurrentPassword('');
                    setNewPassword('');
                  }}
                  disabled={passwordLoading}
                >
                  Отмена
                </SecondaryButton>
              </ButtonGroup>
            </>
          )}
        </Section>

        <Section>
          <SectionTitle>Управление аккаунтом</SectionTitle>
          <ButtonGroup>
            <SecondaryButton onClick={handleLogout}>
              <LogoutOutlined />
              Выйти из аккаунта
            </SecondaryButton>
            <DangerButton onClick={handleDeleteAccount} disabled={deleteLoading}>
              <DeleteOutlined />
              Удалить аккаунт
            </DangerButton>
          </ButtonGroup>
        </Section>
      </Content>
    </Container>
  );
};
