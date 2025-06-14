<script setup lang="ts">
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import { storeToRefs } from 'pinia';

import AppNotification from '@/shared/modules/notification/components/AppNotification.vue';

const modalsStore = useModalsPool();
const { modalsPool } = storeToRefs(modalsStore);
</script>

<template>
  <v-container fluid>
    <router-view />

    <AppNotification />

    <!-- Dynamic modals -->
    <component
      :is="item.component"
      v-for="item in modalsPool"
      :key="item.name"
      v-bind="item?.data"
    />
  </v-container>
</template>
