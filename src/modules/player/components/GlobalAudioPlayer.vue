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
  <div v-if="hasAudioLoaded">
    <v-card class="w-100 pa-0" elevation="8" rounded="lg">
      <v-row noGutters align="center" class="pa-3">
        <!-- Track Info -->
        <v-col cols="12" md="4" class="d-flex align-center">
          <v-img
            :src="currentTrack?.coverImage || 'https://via.placeholder.com/60?text=No+Cover'"
            :alt="currentTrack?.title || 'Unknown Track'"
            cover
            height="100"
            width="100"
            class="mr-3 player__image rounded-lg"
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
        <v-col cols="12" md="5" class="d-flex flex-column align-center">
          <div class="d-flex align-center justify-center mb-2">
            <v-btn
              aria-label="Previous track"
              icon="mdi-skip-previous"
              variant="text"
              size="small"
              data-testid="prev-track-button"
              disabled
            />
            <v-btn
              aria-label="Play/Pause"
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
              aria-label="Stop track"
              icon="mdi-stop"
              variant="text"
              size="small"
              class="mr-2"
              data-testid="stop-track-button"
              @click="handleStop"
            />
            <v-btn
              aria-label="Next track"
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
          <v-icon
            aria-label="Volume"
            :icon="volumeValue > 0 ? 'mdi-volume-high' : 'mdi-volume-off'"
            class="mr-2"
          />
          <v-slider
            aria-label="Volume"
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
.player__image {
  max-width: 250px;
}
</style>
