<template>
  <div class="track-list-graphql">
    <div class="header">
      <h2>Tracks (GraphQL)</h2>
      <v-btn
        aria-label="Add track"
        color="primary"
        prependIcon="mdi-plus"
        @click="openCreateDialog"
      >
        Add Track
      </v-btn>
    </div>

    <div class="filters">
      <v-text-field
        aria-label="Search tracks"
        v-model="searchTerm"
        label="Search tracks..."
        clearable
        prependInnerIcon="mdi-magnify"
        variant="outlined"
        density="compact"
        @update:model-value="handleSearch"
      />

      <v-select
        aria-label="Filter by genre"
        v-model="selectedGenre"
        :items="genres"
        label="Filter by genre"
        clearable
        variant="outlined"
        density="compact"
        @update:model-value="handleGenreFilter"
      />
    </div>

    <v-progress-linear
      aria-label="Loading tracks"
      v-if="tracksLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <v-alert v-if="tracksError" type="error" class="mb-4">
      Error loading tracks: {{ tracksError.message }}
    </v-alert>

    <div v-if="!tracksLoading && tracks.length === 0" class="empty-state">
      <v-icon aria-label="No tracks found" size="64" color="grey-lighten-1">mdi-music-off</v-icon>
      <h3>No tracks found</h3>
      <p>Add your first track to get started</p>
    </div>

    <v-row v-else-if="!tracksLoading">
      <v-col v-for="track in tracks" :key="track.id" cols="12" md="6" lg="4">
        <v-card elevation="2" hover>
          <v-img
            v-if="track.coverImage"
            :src="track.coverImage"
            height="200"
            cover
            :alt="track.title"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular aria-label="Loading track" indeterminate />
              </div>
            </template>
          </v-img>
          <div v-else class="cover-placeholder">
            <v-icon aria-label="No cover image" size="64" color="grey-lighten-1">mdi-music</v-icon>
          </div>

          <v-card-title class="text-truncate">{{ track.title }}</v-card-title>
          <v-card-subtitle class="text-truncate">{{ track.artist }}</v-card-subtitle>

          <v-card-text>
            <div v-if="track.album" class="text-truncate mb-1">
              <strong>Album:</strong> {{ track.album }}
            </div>
            <div class="genres">
              <v-chip
                v-for="genre in track.genres"
                :key="genre"
                size="x-small"
                class="mr-1 mb-1"
                color="primary"
                variant="outlined"
              >
                {{ genre }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              v-if="track.audioFile"
              aria-label="Play/Pause track"
              :icon="playerStore.isTrackPlaying(track.id) ? 'mdi-pause' : 'mdi-play'"
              variant="text"
              color="primary"
              :loading="playerStore.loading && playerStore.currentTrack?.id === track.id"
              @click="handlePlayPause(track)"
            />

            <v-btn
              aria-label="Edit track"
              icon="mdi-pencil"
              variant="text"
              color="primary"
              @click="handleEdit(track)"
            />

            <v-btn
              aria-label="Delete track"
              icon="mdi-delete"
              variant="text"
              color="error"
              :loading="deleteLoading"
              @click="handleDelete(track.id)"
            />

            <v-spacer />
            <v-btn
              aria-label="No audio"
              v-if="!track.audioFile"
              size="small"
              variant="outlined"
              color="warning"
              disabled
            >
              No Audio
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination
      aria-label="Pagination"
      v-if="totalPages > 1"
      v-model="currentPageModel"
      :length="totalPages"
      class="mt-4"
      @update:model-value="handlePageChange"
    />

    <div v-if="totalTracks > 0" class="stats">
      <v-chip aria-label="Total tracks" variant="outlined">Total: {{ totalTracks }}</v-chip>
      <v-chip aria-label="Current page" variant="outlined">Page: {{ currentPage }}</v-chip>
    </div>

    <v-dialog v-model="showCreateDialog" maxWidth="600" persistent>
      <v-card>
        <v-card-title>
          <span aria-label="Track title" class="text-h6">{{
            editingTrack ? 'Edit Track' : 'Create New Track'
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
            <v-text-field
              aria-label="Title"
              v-model="formData.title"
              label="Title"
              :rules="[v => !!v || 'Title is required']"
              required
              variant="outlined"
            />

            <v-text-field
              aria-label="Artist"
              v-model="formData.artist"
              label="Artist"
              :rules="[v => !!v || 'Artist is required']"
              required
              variant="outlined"
            />

            <v-text-field
              aria-label="Album"
              v-model="formData.album"
              label="Album"
              variant="outlined"
            />

            <v-select
              aria-label="Genres"
              v-model="formData.genres"
              :items="genres"
              label="Genres"
              multiple
              chips
              closableChips
              variant="outlined"
              :rules="[v => v.length > 0 || 'At least one genre is required']"
            />

            <v-text-field
              aria-label="Cover Image URL"
              v-model="formData.coverImage"
              label="Cover Image URL"
              variant="outlined"
              :rules="[validateImageUrl]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn aria-label="Cancel" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn
            aria-label="Submit track"
            color="primary"
            :loading="editingTrack ? updateLoading : createLoading"
            :disabled="!formValid"
            @click="handleSubmit"
          >
            {{ editingTrack ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTrackGraphQL } from '../composables/useTrackGraphQL';
import { useGenresGraphQL } from '@/shared/modules/genres/composables/useGenresGraphQL';
import { usePlayerStore } from '@/modules/player/store/playerStore';
import { useNotificationStore } from '@/shared/modules/notification/store/notification';
import type { Track, TrackFormData } from '../types';

const {
  tracks,
  totalTracks,
  totalPages,
  currentPage,
  tracksLoading,
  createLoading,
  updateLoading,
  deleteLoading,
  tracksError,
  updateFilters,
  updatePage,
  updateSearch,
  createTrack,
  updateTrack,
  deleteTrack,
} = useTrackGraphQL();

const { genres } = useGenresGraphQL();
const playerStore = usePlayerStore();
const notificationStore = useNotificationStore();

const searchTerm = ref('');
const selectedGenre = ref('');
const showCreateDialog = ref(false);
const currentPageModel = ref(1);
const editingTrack = ref<Track | null>(null);
const formRef = ref();
const formValid = ref(false);

const formData = ref<TrackFormData>({
  title: '',
  artist: '',
  album: '',
  genres: [],
  coverImage: '',
});

watch(currentPage, newPage => {
  currentPageModel.value = newPage;
});

const validateImageUrl = (url: string) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return 'Please enter a valid URL';
  }
};

const resetForm = () => {
  formData.value = {
    title: '',
    artist: '',
    album: '',
    genres: [],
    coverImage: '',
  };
  editingTrack.value = null;
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const openCreateDialog = () => {
  resetForm();
  showCreateDialog.value = true;
};

const closeDialog = () => {
  showCreateDialog.value = false;
  resetForm();
};

const handleSearch = (value: string) => {
  updateSearch(value || '');
};

const handleGenreFilter = (genre: string) => {
  updateFilters({ genre: genre || undefined, page: 1 });
};

const handlePageChange = (page: number) => {
  updatePage(page);
};

const handlePlayPause = async (track: Track) => {
  try {
    if (playerStore.isTrackPlaying(track.id)) {
      playerStore.pauseTrack();
    } else if (playerStore.isTrackPaused(track.id)) {
      await playerStore.resumeTrack();
    } else {
      await playerStore.playTrack(track);
    }
  } catch (error) {
    console.error('Error playing track:', error);
    notificationStore.notify('Failed to play track', 'error');
  }
};

const handleEdit = (track: Track) => {
  editingTrack.value = track;
  formData.value = {
    title: track.title,
    artist: track.artist,
    album: track.album || '',
    genres: [...track.genres],
    coverImage: track.coverImage || '',
  };
  showCreateDialog.value = true;
};

const handleDelete = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this track?')) {
    try {
      await deleteTrack(id);
      notificationStore.notify('Track deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting track:', error);
      notificationStore.notify('Failed to delete track', 'error');
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    if (editingTrack.value) {
      await updateTrack(editingTrack.value.id, formData.value);
      notificationStore.notify('Track updated successfully', 'success');
    } else {
      await createTrack(formData.value);
      notificationStore.notify('Track created successfully', 'success');
    }
    closeDialog();
  } catch (error) {
    console.error('Error saving track:', error);
    notificationStore.notify(
      `Failed to ${editingTrack.value ? 'update' : 'create'} track`,
      'error'
    );
  }
};
</script>

<style scoped>
.track-list-graphql {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.empty-state h3 {
  margin: 16px 0 8px;
}

.cover-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-theme-surface-variant));
}

.genres {
  min-height: 32px;
}

.stats {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
