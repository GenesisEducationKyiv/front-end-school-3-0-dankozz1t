<script setup lang="ts">
import AppNotification from '@/shared/components/AppNotification.vue';
import AppLayout from '@/shared/components/AppLayout.vue';
import { useVisiblePool } from '@/stores/visiblePool';
import { storeToRefs } from 'pinia';

const visibleStore = useVisiblePool();
const { visiblePool } = storeToRefs(visibleStore);
</script>

<template>
  <AppLayout>
    <router-view />

    <AppNotification />

    <!-- Dynamic modals and overlays -->
    <component
      :is="item.component"
      v-for="item in visiblePool"
      :key="item.name"
      v-bind="item?.data"
    />
  </AppLayout>
</template>

<style>
/* Global styles */
.v-main {
  min-height: 100vh;
}

/* Ensure proper spacing for mobile */
@media (max-width: 960px) {
  .v-main {
    padding-bottom: 80px;
  }
}
</style>
