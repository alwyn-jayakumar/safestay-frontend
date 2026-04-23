import { notifications } from '@mantine/notifications';

export const toast = {
  success: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 4000,
    });
  },
  error: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 6000,
    });
  },
  info: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: 'blue',
    });
  }
};