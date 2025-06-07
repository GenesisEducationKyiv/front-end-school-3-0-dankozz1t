<script setup lang="ts">
import { computed } from 'vue';
import { useTrackStore } from '@/modules/track/store/trackStore';

const trackStore = useTrackStore();

const searchInput = computed({
  get: () => trackStore.searchQuery,
  set: (value: string) => {
    trackStore.updateSearchQuery(value);
  },
});
</script>

<template>
  <v-text-field
    v-model="searchInput"
    placeholder="Search tracks by title, artist, or album..."
    prependInnerIcon="mdi-magnify"
    variant="outlined"
    density="compact"
    clearable
    data-testid="track-search-input"
    class="mb-4"
  />
</template>
