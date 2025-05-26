<script setup lang="ts">
import { useDebounce } from '@/composables/useDebounce';
import { useTracksStore } from '@/stores/tracks';
import { watch } from 'vue';

const tracksStore = useTracksStore();
const { value: searchInput, debouncedValue: searchQuery } = useDebounce('', 500);

watch(searchQuery, newQuery => {
  tracksStore.searchQuery = newQuery;
  tracksStore.currentPage = 1;
  tracksStore.fetchTracks();
});
</script>

<template>
  <v-text-field
    v-model="searchInput"
    data-testid="search-input"
    label="Search by title, artist, or album"
    variant="outlined"
    density="comfortable"
    prependInnerIcon="mdi-magnify"
    hideDetails
    clearable
  />
</template>
