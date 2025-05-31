<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
</script>

<template>
  <v-snackbar
    v-model="notificationStore.show"
    :color="notificationStore.type"
    :timeout="notificationStore.timeout"
    data-testid="toast-container"
  >
    <span :data-testid="`toast-${notificationStore.type}`">
      {{ notificationStore.message }}
    </span>

    <template #actions>
      <v-btn variant="text" icon="mdi-close" @click="notificationStore.hideNotification" />
    </template>
  </v-snackbar>
</template>
