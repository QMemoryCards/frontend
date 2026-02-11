import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setGlobalMessage,
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from './toast';

describe('toast utilities', () => {
  const mockMessageApi = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setGlobalMessage(null);
  });

  describe('setGlobalMessage', () => {
    it('should set global message API', () => {
      setGlobalMessage(mockMessageApi);
      showSuccess('Test');
      expect(mockMessageApi.success).toHaveBeenCalledWith('Test', 3, undefined);
    });
  });

  describe('showToast', () => {
    it('should show warning when message API not initialized', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      showToast('success', 'Test message');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Toast message API not initialized. Message:',
        'Test message'
      );
      consoleWarnSpy.mockRestore();
    });

    it('should call success method with default duration', () => {
      setGlobalMessage(mockMessageApi);
      showToast('success', 'Success message');
      expect(mockMessageApi.success).toHaveBeenCalledWith('Success message', 3, undefined);
    });

    it('should call error method with custom duration', () => {
      setGlobalMessage(mockMessageApi);
      showToast('error', 'Error message', { duration: 5 });
      expect(mockMessageApi.error).toHaveBeenCalledWith('Error message', 5, undefined);
    });

    it('should call warning method with onClose callback', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showToast('warning', 'Warning message', { onClose });
      expect(mockMessageApi.warning).toHaveBeenCalledWith('Warning message', 3, onClose);
    });

    it('should call info method with all options', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showToast('info', 'Info message', { duration: 10, onClose });
      expect(mockMessageApi.info).toHaveBeenCalledWith('Info message', 10, onClose);
    });
  });

  describe('showSuccess', () => {
    it('should call showToast with success type', () => {
      setGlobalMessage(mockMessageApi);
      showSuccess('Success message');
      expect(mockMessageApi.success).toHaveBeenCalledWith('Success message', 3, undefined);
    });

    it('should pass options to showToast', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showSuccess('Success message', { duration: 5, onClose });
      expect(mockMessageApi.success).toHaveBeenCalledWith('Success message', 5, onClose);
    });
  });

  describe('showError', () => {
    it('should call showToast with error type', () => {
      setGlobalMessage(mockMessageApi);
      showError('Error message');
      expect(mockMessageApi.error).toHaveBeenCalledWith('Error message', 3, undefined);
    });

    it('should pass options to showToast', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showError('Error message', { duration: 5, onClose });
      expect(mockMessageApi.error).toHaveBeenCalledWith('Error message', 5, onClose);
    });
  });

  describe('showWarning', () => {
    it('should call showToast with warning type', () => {
      setGlobalMessage(mockMessageApi);
      showWarning('Warning message');
      expect(mockMessageApi.warning).toHaveBeenCalledWith('Warning message', 3, undefined);
    });

    it('should pass options to showToast', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showWarning('Warning message', { duration: 5, onClose });
      expect(mockMessageApi.warning).toHaveBeenCalledWith('Warning message', 5, onClose);
    });
  });

  describe('showInfo', () => {
    it('should call showToast with info type', () => {
      setGlobalMessage(mockMessageApi);
      showInfo('Info message');
      expect(mockMessageApi.info).toHaveBeenCalledWith('Info message', 3, undefined);
    });

    it('should pass options to showToast', () => {
      setGlobalMessage(mockMessageApi);
      const onClose = vi.fn();
      showInfo('Info message', { duration: 5, onClose });
      expect(mockMessageApi.info).toHaveBeenCalledWith('Info message', 5, onClose);
    });
  });
});
