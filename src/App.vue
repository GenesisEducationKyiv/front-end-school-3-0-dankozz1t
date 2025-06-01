<script setup lang="ts">
import { usePlayerStore } from '@/modules/player/store/playerStore';
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import AppNotification from '@/shared/modules/notification/components/AppNotification.vue';
import GlobalAudioPlayer from '@/modules/player/components/GlobalAudioPlayer.vue';

const modalsStore = useModalsPool();
const { modalsPool } = storeToRefs(modalsStore);

const playerStore = usePlayerStore();
const hasPlayerVisible = computed(() => playerStore.hasAudioLoaded);
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

    <GlobalAudioPlayer v-if="hasPlayerVisible" />
  </v-container>
</template>
