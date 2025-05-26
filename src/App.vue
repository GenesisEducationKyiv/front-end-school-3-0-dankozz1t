<script setup lang="ts">
import AppNotification from '@/components/Base/AppNotification.vue';
import { useVisiblePool } from '@/stores/visiblePool';
import { storeToRefs } from 'pinia';

const visibleStore = useVisiblePool();
const { visiblePool } = storeToRefs(visibleStore);
</script>

<template>
  <v-app>
    <router-view />

    <AppNotification />

    <component
      :is="item.component"
      v-for="item in visiblePool"
      :key="item.name"
      v-bind="item?.data"
    />
  </v-app>
</template>

<style>
.v-main {
  min-height: 100vh;
  padding-bottom: 80px; /* Space for the global audio player */
}
</style>
