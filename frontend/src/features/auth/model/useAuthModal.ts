import { useState } from 'react';

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register' | 'phone'>('login');

  const openLogin = () => {
    setAuthType('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setAuthType('register');
    setIsOpen(true);
  };

  const openPhoneLogin = () => {
    setAuthType('phone');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    authType,
    openLogin,
    openRegister,
    openPhoneLogin,
    close,
  };
};