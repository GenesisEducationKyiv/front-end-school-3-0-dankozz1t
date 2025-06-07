<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import TrackListItem from './TrackListItem.vue';

const trackStore = useTrackStore();
const modalsStore = useModalsPool();

const bulkSelectMode = ref<boolean>(false);

watch(
  () => trackStore.currentPage,
  async () => {
    await trackStore.fetchTracks();
  }
);

const handleCreateTrack = (): void => {
  modalsStore.addVisibleItem('TrackForm');
};

const handleBulkDelete = (): void => {
  if (trackStore.selectedTracks.length > 0) {
    modalsStore.addVisibleItem('DeleteTrack', { trackIds: trackStore.selectedTracks });
  }
};

const toggleBulkMode = (): void => {
  bulkSelectMode.value = !bulkSelectMode.value;
  if (!bulkSelectMode.value) {
    trackStore.clearSelectedTracks();
  }
};

const handleSelectAll = (): void => {
  trackStore.selectAllTracks(trackStore.tracks);
};

const handleClearSelection = (): void => {
  trackStore.clearSelectedTracks();
};
</script>

<template>
  <div>
    <v-toolbar class="mb-4">
      <v-toolbar-title>Tracks</v-toolbar-title>
      <v-spacer />

      <!-- Bulk Selection Controls -->
      <div v-if="bulkSelectMode" class="d-flex align-center mr-2">
        <v-chip v-if="trackStore.selectedCount > 0" size="small" color="primary" class="mr-2">
          {{ trackStore.selectedCount }} selected
        </v-chip>
        <v-btn
          v-if="trackStore.selectedCount < trackStore.tracks.length"
          variant="text"
          size="small"
          @click="handleSelectAll"
        >
          Select All
        </v-btn>
        <v-btn
          v-if="trackStore.selectedCount > 0"
          variant="text"
          size="small"
          @click="handleClearSelection"
        >
          Clear
        </v-btn>
      </div>

      <v-btn
        v-if="!bulkSelectMode"
        color="primary"
        prependIcon="mdi-plus"
        data-testid="create-track-button"
        @click="handleCreateTrack"
      >
        Add Track
      </v-btn>
      <v-btn
        v-else
        color="error"
        prependIcon="mdi-delete"
        :disabled="trackStore.selectedTracks.length === 0"
        data-testid="bulk-delete-button"
        @click="handleBulkDelete"
      >
        Delete Selected ({{ trackStore.selectedCount }})
      </v-btn>
      <v-btn
        :icon="bulkSelectMode ? 'mdi-close' : 'mdi-checkbox-multiple-marked'"
        variant="text"
        class="ml-2"
        data-testid="toggle-bulk-mode-button"
        @click="toggleBulkMode"
      />
    </v-toolbar>

    <!-- Track List -->
    <div v-if="trackStore.loading" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="trackStore.tracks.length === 0" class="text-center my-4">
      <v-icon size="64" color="grey">mdi-music-off</v-icon>
      <div class="text-h6 mt-4">No tracks found</div>
      <div class="text-body-1 text-grey">Add your first track to get started</div>
    </div>

    <div v-else>
      <TrackListItem
        v-for="track in trackStore.tracks"
        :key="track.id"
        :track="track"
        :bulkSelectMode="bulkSelectMode"
        :selected="trackStore.isTrackSelected(track.id)"
      />
    </div>

    <!-- Pagination -->
    <v-pagination
      v-if="trackStore.totalPages > 1"
      v-model="trackStore.currentPage"
      :length="trackStore.totalPages"
      class="mt-4"
      data-testid="pagination"
    />

    <!-- Summary -->
    <div v-if="trackStore.tracks.length > 0" class="text-center mt-4 text-caption text-grey">
      Showing {{ trackStore.tracks.length }} of {{ trackStore.totalTracks }} tracks
    </div>
  </div>
</template>
