<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { useGenresStore } from '@/shared/modules/genres/store/genres';
import type { TrackSortField, TrackSortOrder } from '../types';

const trackStore = useTrackStore();
const genresStore = useGenresStore();

onMounted(async () => {
  if (genresStore.genres.length === 0) {
    await genresStore.fetchGenres();
  }
});

const availableArtists = computed(() => {
  const artists = new Set<string>();
  trackStore.tracks.forEach(track => artists.add(track.artist));
  return Array.from(artists).sort();
});

const selectedGenre = computed({
  get: () => trackStore.selectedGenre,
  set: (value: string | null) => {
    trackStore.updateGenreFilter(value);
  },
});

const selectedArtist = computed({
  get: () => trackStore.selectedArtist,
  set: (value: string | null) => {
    trackStore.updateArtistFilter(value);
  },
});

const sortBy = computed({
  get: () => trackStore.sortBy,
  set: (value: TrackSortField) => {
    trackStore.updateSorting(value, trackStore.sortOrder);
  },
});

const sortOrder = computed({
  get: () => trackStore.sortOrder,
  set: (value: TrackSortOrder) => {
    trackStore.updateSorting(trackStore.sortBy, value);
  },
});

const clearAllFilters = (): void => {
  trackStore.resetFilters();
};

const hasActiveFilters = computed(() => {
  return trackStore.selectedGenre || trackStore.selectedArtist || trackStore.searchQuery;
});

const sortOptions: { title: string; value: TrackSortField; order: TrackSortOrder }[] = [
  { title: 'Date Added (Newest)', value: 'createdAt', order: 'desc' },
  { title: 'Date Added (Oldest)', value: 'createdAt', order: 'asc' },
  { title: 'Title (A-Z)', value: 'title', order: 'asc' },
  { title: 'Title (Z-A)', value: 'title', order: 'desc' },
  { title: 'Artist (A-Z)', value: 'artist', order: 'asc' },
  { title: 'Artist (Z-A)', value: 'artist', order: 'desc' },
  { title: 'Album (A-Z)', value: 'album', order: 'asc' },
  { title: 'Album (Z-A)', value: 'album', order: 'desc' },
];

const currentSortKey = computed(() => {
  const option = sortOptions.find(
    option => option.value === sortBy.value && option.order === sortOrder.value
  );
  return option ? `${option.value}-${option.order}` : 'createdAt-desc';
});

const sortOptionsWithKeys = computed(() => {
  return sortOptions.map(option => ({
    ...option,
    key: `${option.value}-${option.order}`,
  }));
});

const updateSort = (key: string): void => {
  const option = sortOptions.find(opt => `${opt.value}-${opt.order}` === key);
  if (option) {
    trackStore.updateSorting(option.value, option.order);
  }
};

const updateItemsPerPage = (value: number): void => {
  trackStore.updateItemsPerPage(value);
};
</script>

<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title class="pb-2">
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-subtitle-1" data-testid="filters-title">Filters & Sorting</span>
        <v-btn
          aria-label="Clear all filters"
          v-if="hasActiveFilters"
          variant="text"
          size="small"
          color="primary"
          prependIcon="mdi-filter-remove"
          data-testid="clear-all-filters"
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
            aria-label="Filter by Genre"
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
            aria-label="Filter by Artist"
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
            aria-label="Sort by"
            :modelValue="currentSortKey"
            :items="sortOptionsWithKeys"
            label="Sort by"
            itemTitle="title"
            itemValue="key"
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
            aria-label="Items per page"
            :modelValue="trackStore.itemsPerPage"
            :items="[10, 20, 50, 100]"
            label="Per page"
            prependIcon="mdi-format-list-numbered"
            variant="outlined"
            density="compact"
            data-testid="items-per-page"
            @update:modelValue="updateItemsPerPage"
          />
        </v-col>
      </v-row>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-3" data-testid="active-filters">
        <div class="text-caption text-grey mb-2">Active filters:</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-if="trackStore.searchQuery"
            size="small"
            aria-label="Search filter"
            closable
            color="primary"
            data-testid="search-filter-chip"
            @click:close="trackStore.updateSearchQuery('')"
          >
            Search: "{{ trackStore.searchQuery }}"
          </v-chip>
          <v-chip
            v-if="trackStore.selectedGenre"
            size="small"
            aria-label="Genre filter"
            closable
            color="success"
            data-testid="genre-filter-chip"
            @click:close="selectedGenre = null"
          >
            Genre: {{ trackStore.selectedGenre }}
          </v-chip>
          <v-chip
            v-if="trackStore.selectedArtist"
            size="small"
            aria-label="Artist filter"
            closable
            color="info"
            data-testid="artist-filter-chip"
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
