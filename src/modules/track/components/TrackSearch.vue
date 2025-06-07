<script setup lang="ts">
import { watch } from 'vue';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { useDebounce } from '@/shared/composables/useDebounce';

const trackStore = useTrackStore();

const { value: searchInput, debouncedValue: debouncedSearch } = useDebounce(
  trackStore.searchQuery,
  500
);

watch(debouncedSearch, async newSearch => {
  trackStore.updateSearchQuery(newSearch);
  await trackStore.fetchTracks();
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
