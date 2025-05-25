<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTracksStore } from '@/stores/tracks';
import { useGenresStore } from '@/stores/genres';
import { useVisiblePool } from '@/stores/visiblePool';
import { useDebounce } from '@/composables/useDebounce';
import { type Track } from '@/services/tracks';
import TrackListItem from '@/components/Tracks/TrackListItem.vue';
import TrackSearch from '@/components/Tracks/TrackSearch.vue';
import CreateTrackButton from '@/components/Tracks/CreateTrackButton.vue';
import LoadingIndicator from '@/components/Base/LoadingIndicator.vue';

const visibleStore = useVisiblePool();

const tracksStore = useTracksStore();
const genresStore = useGenresStore();

const searchInput = useDebounce<string>('', 300);
const selectedTrack = ref<Track | null>(null);
const showTrackFormModal = ref<boolean>(false);
const showUploadModal = ref<boolean>(false);
const isInBulkMode = ref<boolean>(false);
const deleteTrackIds = ref<string[]>([]);
const sortOption = ref<string>('newest');

interface SortOption {
  title: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'Title (A-Z)', value: 'title_asc' },
  { title: 'Title (Z-A)', value: 'title_desc' },
  { title: 'Artist (A-Z)', value: 'artist_asc' },
  { title: 'Artist (Z-A)', value: 'artist_desc' },
];

const selectedTracks = computed(() => tracksStore.selectedTracks);

const allSelected = computed(() => {
  return (
    tracksStore.tracks.length > 0 &&
    tracksStore.tracks.every(track => selectedTracks.value.includes(track.id))
  );
});

const uniqueArtists = computed<string[]>(() => {
  const artists = tracksStore.tracks.map(track => track.artist);
  return [...new Set(artists)].sort();
});

onMounted(async () => {
  if (genresStore.genres.length === 0) {
    await genresStore.fetchGenres();
  }

  await tracksStore.fetchTracks();
});

watch(
  [
    () => tracksStore.currentPage,
    () => searchInput.debouncedValue,
    () => tracksStore.selectedGenre,
    () => tracksStore.selectedArtist,
    () => sortOption.value,
  ],
  async () => {
    updateSortOptions();

    tracksStore.searchQuery = searchInput.debouncedValue;

    await tracksStore.fetchTracks();
  },
  { deep: true }
);

function updateSortOptions(): void {
  const sortMap = {
    newest: { sortBy: 'createdAt', sortOrder: 'desc' },
    oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
    title_asc: { sortBy: 'title', sortOrder: 'asc' },
    title_desc: { sortBy: 'title', sortOrder: 'desc' },
    artist_asc: { sortBy: 'artist', sortOrder: 'asc' },
    artist_desc: { sortBy: 'artist', sortOrder: 'desc' },
  };

  const { sortBy, sortOrder } = sortMap[sortOption.value] ?? sortMap.newest;
  tracksStore.sortBy = sortBy;
  tracksStore.sortOrder = sortOrder;
}

function openCreateDialog(): void {
  selectedTrack.value = null;
  visibleStore.addVisibleItem('TrackForm');
}

function openEditDialog(track: Track): void {
  selectedTrack.value = track;
  showTrackFormModal.value = true;
}

function openUploadDialog(track: Track): void {
  selectedTrack.value = track;
  showUploadModal.value = true;
}

function openDeleteDialog(track: Track | null, ids?: string[]): void {
  if (track) {
    selectedTrack.value = track;
    deleteTrackIds.value = [];
  } else if (ids && ids.length > 0) {
    selectedTrack.value = null;
    deleteTrackIds.value = [...ids];
  }

  visibleStore.addVisibleItem('DeleteTrack', { track, trackIds: ids });
}

function toggleBulkMode(): void {
  if (isInBulkMode.value) {
    isInBulkMode.value = false;
    tracksStore.clearSelectedTracks();
  } else {
    isInBulkMode.value = true;
  }
}

function handleSelectAll(value: boolean): void {
  if (value) {
    tracksStore.selectAllTracks();
  } else {
    tracksStore.clearSelectedTracks();
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 data-testid="tracks-header" class="text-h4">Music Tracks</h1>
      <v-spacer />

      <!-- Bulk actions -->
      <div v-if="isInBulkMode" class="d-flex align-center mr-2">
        <v-chip class="mr-2">{{ selectedTracks.length }} selected</v-chip>
        <v-btn
          color="error"
          variant="outlined"
          data-testid="bulk-delete-button"
          :disabled="selectedTracks.length === 0"
          @click="openDeleteDialog(null, selectedTracks)"
        >
          Delete Selected
        </v-btn>
      </div>

      <!-- Mode toggle -->
      <v-btn
        :color="isInBulkMode ? 'warning' : 'primary'"
        variant="text"
        class="mr-2"
        data-testid="select-mode-toggle"
        @click="toggleBulkMode"
      >
        <v-icon
          :icon="isInBulkMode ? 'mdi-close' : 'mdi-checkbox-multiple-marked-outline'"
          class="mr-1"
        />
        {{ isInBulkMode ? 'Cancel' : 'Select' }}
      </v-btn>

      <CreateTrackButton />
    </div>

    <!-- Search and filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <TrackSearch />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="tracksStore.selectedGenre"
              :items="genresStore.genres"
              data-testid="filter-genre"
              label="Filter by Genre"
              variant="outlined"
              density="comfortable"
              hideDetails
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="tracksStore.selectedArtist"
              :items="uniqueArtists"
              data-testid="filter-artist"
              label="Filter by Artist"
              variant="outlined"
              density="comfortable"
              hideDetails
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              data-testid="sort-select"
              label="Sort by"
              variant="outlined"
              density="comfortable"
              hideDetails
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading indicator -->
    <LoadingIndicator v-if="tracksStore.loading" data-testid="loading-tracks" />

    <!-- Tracks list -->
    <div v-else-if="tracksStore.tracks.length > 0">
      <div v-if="isInBulkMode" class="d-flex align-center px-2 py-2 mb-2">
        <v-checkbox
          v-model="allSelected"
          data-testid="select-all"
          label="Select All"
          hideDetails
          density="comfortable"
          @update:modelValue="handleSelectAll"
        />
      </div>

      <div class="tracks-list">
        <TrackListItem
          v-for="track in tracksStore.tracks"
          :key="track.id"
          :track="track"
          :bulkSelectMode="isInBulkMode"
          :selected="selectedTracks.includes(track.id)"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @upload="openUploadDialog"
        />
      </div>

      <div data-testid="pagination" class="d-flex justify-center mt-4">
        <v-pagination
          v-model="tracksStore.currentPage"
          :length="tracksStore.totalPages"
          :totalVisible="7"
          rounded
          @update:modelValue="tracksStore.fetchTracks()"
        >
          <template #prev>
            <v-btn
              data-testid="pagination-prev"
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="tracksStore.currentPage > 1 ? tracksStore.currentPage-- : null"
            />
          </template>
          <template #next>
            <v-btn
              data-testid="pagination-next"
              icon="mdi-chevron-right"
              variant="text"
              @click.stop="
                tracksStore.currentPage < tracksStore.totalPages ? tracksStore.currentPage++ : null
              "
            />
          </template>
        </v-pagination>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center my-8">
      <v-icon icon="mdi-music-off" size="64" color="grey" />
      <h3 class="text-h5 mt-4">No tracks found</h3>
      <p class="text-body-1 mb-4">Try adjusting your search or filters, or add a new track.</p>
      <v-btn color="primary" prependIcon="mdi-plus" @click="openCreateDialog"> Create Track </v-btn>
    </div>
  </div>
</template>

<style scoped>
.tracks-list {
  max-width: 100%;
}
</style>
