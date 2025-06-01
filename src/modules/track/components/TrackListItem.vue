<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { useTrackStore } from '../store/trackStore';
import { usePlayerStore } from '../../player/store/playerStore';
import { useModalsPool } from '@/stores/modalsPool';
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
const visibleStore = useModalsPool();

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
  visibleStore.addVisibleItem('TrackForm', { track: props.track });
};

const handleUpload = (): void => {
  visibleStore.addVisibleItem('UploadTrackFile', { track: props.track });
};

const handleDelete = (): void => {
  visibleStore.addVisibleItem('DeleteTrack', { track: props.track });
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
        <v-img
          v-if="track.coverImage"
          :src="track.coverImage"
          :alt="track.title"
          class="track-image ma-2"
          width="80"
          cover
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
        </v-img>
        <div v-else>
          <v-icon icon="mdi-music" size="64" color="grey" />
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

.track-image {
  height: 80px;
  min-height: 80px;

  @media (max-width: 600px) {
    height: 160px;
    min-height: 160px;
  }
}
</style>
