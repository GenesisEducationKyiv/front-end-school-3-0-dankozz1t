<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTrackStore } from '../store/trackStore';
import { useGenresStore } from '@/stores/genres';

const trackStore = useTrackStore();
const genresStore = useGenresStore();

onMounted(async () => {
  // Fetch available genres for filtering
  if (genresStore.genres.length === 0) {
    await genresStore.fetchGenres();
  }
});

// Get unique artists from current tracks for filtering
const availableArtists = computed(() => {
  const artists = new Set<string>();
  trackStore.tracks.forEach(track => artists.add(track.artist));
  return Array.from(artists).sort();
});

const selectedGenre = computed({
  get: () => trackStore.selectedGenre,
  set: async (value: string | null) => {
    trackStore.updateGenreFilter(value);
    await trackStore.fetchTracks();
  },
});

const selectedArtist = computed({
  get: () => trackStore.selectedArtist,
  set: async (value: string | null) => {
    trackStore.updateArtistFilter(value);
    await trackStore.fetchTracks();
  },
});

const sortBy = computed({
  get: () => trackStore.sortBy,
  set: async (value: string) => {
    trackStore.updateSorting(value, trackStore.sortOrder);
    await trackStore.fetchTracks();
  },
});

const sortOrder = computed({
  get: () => trackStore.sortOrder,
  set: async (value: 'asc' | 'desc') => {
    trackStore.updateSorting(trackStore.sortBy, value);
    await trackStore.fetchTracks();
  },
});

const clearAllFilters = async (): Promise<void> => {
  trackStore.resetFilters();
  await trackStore.fetchTracks();
};

const hasActiveFilters = computed(() => {
  return trackStore.selectedGenre || trackStore.selectedArtist || trackStore.searchQuery;
});

const sortOptions = [
  { title: 'Date Added (Newest)', value: 'createdAt', order: 'desc' },
  { title: 'Date Added (Oldest)', value: 'createdAt', order: 'asc' },
  { title: 'Title (A-Z)', value: 'title', order: 'asc' },
  { title: 'Title (Z-A)', value: 'title', order: 'desc' },
  { title: 'Artist (A-Z)', value: 'artist', order: 'asc' },
  { title: 'Artist (Z-A)', value: 'artist', order: 'desc' },
  { title: 'Album (A-Z)', value: 'album', order: 'asc' },
  { title: 'Album (Z-A)', value: 'album', order: 'desc' },
];

const currentSortOption = computed(() => {
  return (
    sortOptions.find(option => option.value === sortBy.value && option.order === sortOrder.value) ||
    sortOptions[0]
  );
});

const updateSort = async (option: (typeof sortOptions)[0]): Promise<void> => {
  trackStore.updateSorting(option.value, option.order as 'asc' | 'desc');
  await trackStore.fetchTracks();
};
</script>

<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title class="pb-2">
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-subtitle-1">Filters & Sorting</span>
        <v-btn
          v-if="hasActiveFilters"
          variant="text"
          size="small"
          color="primary"
          prependIcon="mdi-filter-remove"
          @click="clearAllFilters"
        >
          Clear All
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pt-0">
      <v-row>
        <!-- Genre Filter -->
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedGenre"
            :items="genresStore.genres"
            label="Filter by Genre"
            clearable
            prependIcon="mdi-music-note"
            variant="outlined"
            density="compact"
            data-testid="genre-filter"
          />
        </v-col>

        <!-- Artist Filter -->
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedArtist"
            :items="availableArtists"
            label="Filter by Artist"
            clearable
            prependIcon="mdi-account-music"
            variant="outlined"
            density="compact"
            data-testid="artist-filter"
          />
        </v-col>

        <!-- Sort Options -->
        <v-col cols="12" md="4">
          <v-select
            :modelValue="currentSortOption"
            :items="sortOptions"
            label="Sort by"
            itemTitle="title"
            returnObject
            prependIcon="mdi-sort"
            variant="outlined"
            density="compact"
            data-testid="sort-select"
            @update:modelValue="updateSort"
          />
        </v-col>

        <!-- Items per page -->
        <v-col cols="12" md="2">
          <v-select
            :modelValue="trackStore.itemsPerPage"
            :items="[10, 20, 50, 100]"
            label="Per page"
            prependIcon="mdi-format-list-numbered"
            variant="outlined"
            density="compact"
            data-testid="items-per-page"
            @update:modelValue="trackStore.updateItemsPerPage"
          />
        </v-col>
      </v-row>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-3">
        <div class="text-caption text-grey mb-2">Active filters:</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-if="trackStore.searchQuery"
            size="small"
            closable
            color="primary"
            @click:close="trackStore.updateSearchQuery('')"
          >
            Search: "{{ trackStore.searchQuery }}"
          </v-chip>
          <v-chip
            v-if="trackStore.selectedGenre"
            size="small"
            closable
            color="success"
            @click:close="selectedGenre = null"
          >
            Genre: {{ trackStore.selectedGenre }}
          </v-chip>
          <v-chip
            v-if="trackStore.selectedArtist"
            size="small"
            closable
            color="info"
            @click:close="selectedArtist = null"
          >
            Artist: {{ trackStore.selectedArtist }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
