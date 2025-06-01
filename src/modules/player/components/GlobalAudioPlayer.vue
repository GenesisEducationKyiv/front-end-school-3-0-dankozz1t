<script setup lang="ts">
import { computed } from 'vue';
import { usePlayerStore } from '@/modules/player/store/playerStore';

const playerStore = usePlayerStore();

const currentTrack = computed(() => playerStore.currentTrack);
const isPlaying = computed(() => playerStore.isPlaying);
const hasAudioLoaded = computed(() => playerStore.hasAudioLoaded);

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const handlePlayPause = async (): Promise<void> => {
  try {
    await playerStore.togglePlayPause();
  } catch (error) {
    console.error('Failed to toggle playback:', error);
  }
};

const handleStop = (): void => {
  playerStore.stopTrack();
};

const handleSeek = (time: number): void => {
  playerStore.seekTo(time);
};

const handleVolumeChange = (volume: number): void => {
  playerStore.setVolume(volume);
};

const progressValue = computed({
  get: () => playerStore.currentTime,
  set: (value: number) => handleSeek(value),
});

const volumeValue = computed({
  get: () => playerStore.volume,
  set: (value: number) => handleVolumeChange(value),
});
</script>

<template>
  <div v-if="hasAudioLoaded" class="global-player">
    <v-card class="w-100" elevation="8">
      <v-row noGutters align="center" class="pa-4">
        <!-- Track Info -->
        <v-col cols="12" md="3" class="d-flex align-center">
          <v-img
            :src="currentTrack?.coverImage || 'https://via.placeholder.com/60?text=No+Cover'"
            :alt="currentTrack?.title || 'Unknown Track'"
            height="60"
            width="60"
            cover
            class="mr-3"
          />
          <div class="text-truncate">
            <div class="text-subtitle-1 font-weight-bold text-truncate">
              {{ currentTrack?.title || 'Unknown Track' }}
            </div>
            <div class="text-caption text-truncate">
              {{ currentTrack?.artist || 'Unknown Artist' }}
            </div>
            <div class="text-caption text-grey text-truncate">
              {{ currentTrack?.album || 'Unknown Album' }}
            </div>
          </div>
        </v-col>

        <!-- Player Controls -->
        <v-col cols="12" md="6" class="d-flex flex-column align-center">
          <div class="d-flex align-center justify-center mb-2">
            <v-btn
              icon="mdi-skip-previous"
              variant="text"
              size="small"
              data-testid="prev-track-button"
              disabled
            />
            <v-btn
              :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
              variant="text"
              size="large"
              class="mx-4"
              color="primary"
              data-testid="play-pause-button"
              :loading="playerStore.loading"
              @click="handlePlayPause"
            />
            <v-btn
              icon="mdi-stop"
              variant="text"
              size="small"
              class="mr-2"
              data-testid="stop-track-button"
              @click="handleStop"
            />
            <v-btn
              icon="mdi-skip-next"
              variant="text"
              size="small"
              data-testid="next-track-button"
              disabled
            />
          </div>

          <!-- Progress Bar -->
          <div class="d-flex align-center w-100">
            <span class="text-caption mr-2" style="min-width: 40px">
              {{ formatTime(playerStore.currentTime) }}
            </span>
            <v-slider
              v-model="progressValue"
              :max="playerStore.duration || 100"
              :step="1"
              hideDetails
              class="flex-grow-1"
              color="primary"
              trackColor="grey-lighten-3"
              data-testid="progress-slider"
            />
            <span class="text-caption ml-2" style="min-width: 40px">
              {{ formatTime(playerStore.duration) }}
            </span>
          </div>
        </v-col>

        <!-- Volume Control -->
        <v-col cols="12" md="3" class="d-flex align-center justify-end">
          <v-icon :icon="volumeValue > 0 ? 'mdi-volume-high' : 'mdi-volume-off'" class="mr-2" />
          <v-slider
            v-model="volumeValue"
            :max="100"
            :step="1"
            hideDetails
            style="max-width: 120px"
            color="primary"
            trackColor="grey-lighten-3"
            data-testid="volume-slider"
          />
          <span class="text-caption ml-2" style="min-width: 30px">
            {{ Math.round(volumeValue) }}%
          </span>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped>
.global-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  background-color: var(--v-surface-base);
  border-top: 1px solid var(--v-border-color);
  z-index: 1000;
}

@media (max-width: 960px) {
  .global-player {
    position: static;
  }
}
</style>
