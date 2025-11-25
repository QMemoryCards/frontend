/**
 * Утилиты для работы с toast-уведомлениями
 * Используется для показа уведомлений об успешных операциях и ошибках
 * Согласно п. 2 Нефункциональных требований
 */

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number; // в секундах
  onClose?: () => void;
}

// Глобальная ссылка на message API из Ant Design
// Будет установлена в AppRouter через App.useApp()
let globalMessage: {
  success: (content: string, duration?: number, onClose?: () => void) => void;
  error: (content: string, duration?: number, onClose?: () => void) => void;
  warning: (content: string, duration?: number, onClose?: () => void) => void;
  info: (content: string, duration?: number, onClose?: () => void) => void;
} | null = null;

/**
 * Установить глобальный message API
 * Должно быть вызвано из компонента с доступом к App.useApp()
 */
export const setGlobalMessage = (messageApi: typeof globalMessage) => {
  globalMessage = messageApi;
};

/**
 * Показать toast-уведомление
 * Может быть вызвано из любого места приложения
 */
export const showToast = (type: MessageType, content: string, options: ToastOptions = {}): void => {
  const { duration = 3, onClose } = options;

  if (!globalMessage) {
    console.warn('Toast message API not initialized. Message:', content);
    return;
  }

  globalMessage[type](content, duration, onClose);
};

/**
 * Показать success toast
 */
export const showSuccess = (content: string, options?: ToastOptions): void => {
  showToast('success', content, options);
};

/**
 * Показать error toast
 */
export const showError = (content: string, options?: ToastOptions): void => {
  showToast('error', content, options);
};

/**
 * Показать warning toast
 */
export const showWarning = (content: string, options?: ToastOptions): void => {
  showToast('warning', content, options);
};

/**
 * Показать info toast
 */
export const showInfo = (content: string, options?: ToastOptions): void => {
  showToast('info', content, options);
};
