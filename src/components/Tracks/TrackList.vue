<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTracksStore } from '@/stores/tracks';
import { useVisiblePool } from '@/stores/visiblePool';
import TrackListItem from './TrackListItem.vue';

const tracksStore = useTracksStore();
const visibleStore = useVisiblePool();

const bulkSelectMode = ref<boolean>(false);

onMounted(async () => {
  await tracksStore.fetchTracks();
});

const handleCreateTrack = (): void => {
  visibleStore.addVisibleItem('TrackForm');
};

const handleBulkDelete = (): void => {
  if (tracksStore.selectedTracks.length > 0) {
    visibleStore.addVisibleItem('DeleteTrack', { trackIds: tracksStore.selectedTracks });
  }
};

const toggleBulkMode = (): void => {
  bulkSelectMode.value = !bulkSelectMode.value;
  if (!bulkSelectMode.value) {
    tracksStore.clearSelectedTracks();
  }
};
</script>

<template>
  <div>
    <v-toolbar class="mb-4">
      <v-toolbar-title>Tracks</v-toolbar-title>
      <v-spacer />
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
        :disabled="tracksStore.selectedTracks.length === 0"
        data-testid="bulk-delete-button"
        @click="handleBulkDelete"
      >
        Delete Selected
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
    <div v-if="tracksStore.loading" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="tracksStore.tracks.length === 0" class="text-center my-4">
      <v-icon size="64" color="grey">mdi-music-off</v-icon>
      <div class="text-h6 mt-4">No tracks found</div>
      <div class="text-body-1 text-grey">Add your first track to get started</div>
    </div>

    <div v-else>
      <TrackListItem
        v-for="track in tracksStore.tracks"
        :key="track.id"
        :track="track"
        :bulkSelectMode="bulkSelectMode"
        :selected="tracksStore.selectedTracks.includes(track.id)"
      />
    </div>

    <v-pagination
      v-if="tracksStore.totalPages > 1"
      v-model="tracksStore.currentPage"
      :length="tracksStore.totalPages"
      class="mt-4"
      data-testid="pagination"
    />
  </div>
</template>
