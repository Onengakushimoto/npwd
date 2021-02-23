import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { BankNotification } from './apps/bank/components/notification/BankNotification';
import { NotificationsProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from './os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './ui/providers/SnackbarProvider';
import Phone from './Phone';

export const PhoneContainer = () => {
  const currentTheme = usePhoneTheme();
  return (
    <ThemeProvider theme={currentTheme}>
      <NotificationsProvider>
        <BankNotification />
        <SnackbarProvider>
          <Phone />
        </SnackbarProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
};
