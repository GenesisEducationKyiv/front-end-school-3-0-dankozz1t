import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationState {
  show: Ref<boolean>;
  message: Ref<string>;
  type: Ref<NotificationType>;
  timeout: Ref<number>;
}

export const useNotificationStore = defineStore('notification', () => {
  const show = ref<boolean>(false);
  const message = ref<string>('');
  const type = ref<NotificationType>('success');
  const timeout = ref<number>(3000);

  /**
   * Display a notification
   * @param msg - Message to display
   * @param notificationType - Type of notification (succes|error|...)
   * @param notificationTimeout - Timeout in ms (default: 3000)
   */
  function notify(
    msg: string,
    notificationType: NotificationType = 'success',
    notificationTimeout: number = 3000
  ): void {
    message.value = msg;
    type.value = notificationType;
    timeout.value = notificationTimeout;
    show.value = true;
  }

  function hideNotification(): void {
    show.value = false;
  }

  return {
    show,
    message,
    type,
    timeout,
    notify,
    hideNotification,
  };
});
