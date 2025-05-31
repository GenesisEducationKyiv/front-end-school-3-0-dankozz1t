<script setup lang="ts">
import { useVisiblePool } from '@/stores/visiblePool';

const visibleStore = useVisiblePool();

const openCreateTrackForm = (): void => {
  visibleStore.addVisibleItem('TrackForm');
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
