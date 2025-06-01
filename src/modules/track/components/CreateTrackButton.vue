<script setup lang="ts">
import { useModalsPool } from '@/stores/modalsPool';

const modalsStore = useModalsPool();

const openCreateTrackForm = (): void => {
  modalsStore.addVisibleItem('TrackForm');
};
</script>

<template>
  <v-btn
    color="primary"
    data-testid="create-track-button"
    prependIcon="mdi-plus"
    @click="openCreateTrackForm"
  >
    Create Track
  </v-btn>
</template>
