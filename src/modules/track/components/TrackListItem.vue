<script setup lang="ts">
import { computed, ref, type ComputedRef } from 'vue';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { usePlayerStore } from '@/modules/player/store/playerStore';
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import type { Track } from '../types';

interface TrackListItemProps {
  track: Track;
  bulkSelectMode?: boolean;
  selected?: boolean;
}

const props = withDefaults(defineProps<TrackListItemProps>(), {
  bulkSelectMode: false,
  selected: false,
});

const trackStore = useTrackStore();
const playerStore = usePlayerStore();
const modalsStore = useModalsPool();

// Track image loading state
const imageError = ref<boolean>(false);
const imageLoading = ref<boolean>(false);

const isPlaying: ComputedRef<boolean> = computed(() => {
  return playerStore.isTrackPlaying(props.track.id);
});

const isPaused: ComputedRef<boolean> = computed(() => {
  return playerStore.isTrackPaused(props.track.id);
});

const isSelected = computed({
  get: () => props.selected,
  set: () => {
    trackStore.toggleTrackSelection(props.track.id);
  },
});

const playTrack = async (): Promise<void> => {
  try {
    if (isPaused.value) {
      await playerStore.resumeTrack();
    } else {
      await playerStore.playTrack(props.track);
    }
  } catch (error) {
    console.error('Failed to play track:', error);
  }
};

const pauseTrack = (): void => {
  playerStore.pauseTrack();
};

const handleEdit = (): void => {
  modalsStore.addVisibleItem('TrackForm', { track: props.track });
};

const handleUpload = (): void => {
  modalsStore.addVisibleItem('UploadTrackFile', { track: props.track });
};

const handleDelete = (): void => {
  modalsStore.addVisibleItem('DeleteTrack', { track: props.track });
};

const handleImageError = (): void => {
  imageError.value = true;
  imageLoading.value = false;
};

const handleImageLoad = (): void => {
  imageError.value = false;
  imageLoading.value = false;
};

const handleImageLoadStart = (): void => {
  imageError.value = false;
  imageLoading.value = true;
};
</script>

<template>
  <v-card :data-testid="`track-item-${track.id}`" class="mb-4">
    <v-row noGutters class="w-100">
      <v-col v-if="bulkSelectMode" cols="1" class="d-flex align-center justify-center">
        <div>
          <v-checkbox
            v-model="isSelected"
            :data-testid="`track-checkbox-${track.id}`"
            hideDetails
            density="compact"
          />
        </div>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center justify-center">
        <div v-if="track.coverImage && !imageError" class="image-container">
          <v-img
            :src="track.coverImage"
            :alt="track.title"
            class="track-image ma-2"
            cover
            @error="handleImageError"
            @load="handleImageLoad"
            @loadstart="handleImageLoadStart"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  v-if="imageLoading"
                  color="grey-lighten-4"
                  indeterminate
                  size="24"
                />
              </div>
            </template>
          </v-img>
        </div>
        <div v-else class="d-flex align-center justify-center" style="width: 80px; height: 80px">
          <v-icon icon="mdi-music" size="48" color="grey" />
        </div>
      </v-col>

      <!-- Track Info -->
      <v-col cols="6" md="4" class="d-flex flex-column justify-center pa-2">
        <div
          :data-testid="`track-item-${track.id}-title`"
          class="text-subtitle-1 font-weight-bold text-truncate"
        >
          {{ track.title }}
        </div>
        <div :data-testid="`track-item-${track.id}-artist`" class="text-caption text-truncate">
          {{ track.artist }}
        </div>
        <div class="text-caption text-truncate">
          {{ track.album || 'No Album' }}
        </div>
      </v-col>

      <!-- Genres -->
      <v-col cols="6" md="3" class="d-flex align-center">
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="genre in track.genres"
            :key="genre"
            size="x-small"
            class="ma-1"
            color="primary"
          >
            {{ genre }}
          </v-chip>
        </div>
      </v-col>

      <!-- Action Buttons -->
      <v-col v-if="!bulkSelectMode" cols="11" md="2" class="d-flex align-center justify-end pr-2">
        <div class="d-flex">
          <v-btn
            :data-testid="`edit-track-${track.id}`"
            icon="mdi-pencil"
            variant="text"
            size="small"
            @click="handleEdit"
          />
          <v-btn
            :data-testid="`upload-track-${track.id}`"
            icon="mdi-upload"
            variant="text"
            size="small"
            @click="handleUpload"
          />
          <v-btn
            :data-testid="`delete-track-${track.id}`"
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            @click="handleDelete"
          />
        </div>
      </v-col>

      <!-- Audio Player -->
      <v-col v-if="track.audioFile" cols="1" class="d-flex align-center justify-center">
        <div :data-testid="`audio-player-${track.id}`" class="audio-player">
          <v-btn
            v-if="!isPlaying"
            :data-testid="`play-button-${track.id}`"
            icon="mdi-play"
            variant="text"
            size="small"
            @click="playTrack"
          />
          <v-btn
            v-else
            :data-testid="`pause-button-${track.id}`"
            icon="mdi-pause"
            variant="text"
            size="small"
            @click="pauseTrack"
          />
          <div
            v-if="isPlaying"
            :data-testid="`audio-progress-${track.id}`"
            class="audio-progress mt-1"
          >
            <v-progress-linear color="primary" height="2" indeterminate />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss">
.audio-player {
  width: 40px;
}
.audio-progress {
  width: 40px;
}

.image-container {
  width: 100%;
}

.track-image {
  height: 80px;
  min-height: 80px;

  @media (max-width: 600px) {
    height: 200px;
    min-height: 200px;
  }
}
</style>
