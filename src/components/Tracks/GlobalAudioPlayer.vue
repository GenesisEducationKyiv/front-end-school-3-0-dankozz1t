<script setup lang="ts">
import { computed } from 'vue';
import { useTracksStore } from '@/stores/tracks';

const tracksStore = useTracksStore();

const currentTrack = computed(() => tracksStore.currentTrack);
const isPlaying = computed(() => tracksStore.hasAudioPlaying);

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const handlePlayPause = (): void => {
  if (isPlaying.value) {
    tracksStore.stopTrack();
  } else if (currentTrack.value) {
    tracksStore.playTrack(currentTrack.value);
  }
};
</script>

<template>
  <div v-if="currentTrack" class="w-100">
    <v-row noGutters align="center" class="px-4">
      <!-- Track Info -->
      <v-col cols="3">
        <div class="d-flex align-center">
          <v-img
            :src="currentTrack.coverImage || 'https://via.placeholder.com/50?text=No+Cover'"
            :alt="currentTrack.title"
            height="50"
            width="50"
            cover
            class="mr-3"
          />
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ currentTrack.title }}</div>
            <div class="text-caption">{{ currentTrack.artist }}</div>
          </div>
        </div>
      </v-col>

      <!-- Player Controls -->
      <v-col cols="6" class="d-flex align-center justify-center">
        <v-btn
          icon="mdi-skip-previous"
          variant="text"
          size="small"
          data-testid="prev-track-button"
        />
        <v-btn
          :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
          variant="text"
          size="large"
          class="mx-4"
          data-testid="play-pause-button"
          @click="handlePlayPause"
        />
        <v-btn icon="mdi-skip-next" variant="text" size="small" data-testid="next-track-button" />
      </v-col>

      <!-- Progress and Volume -->
      <v-col cols="3" class="d-flex align-center justify-end">
        <v-slider
          v-model="tracksStore.currentTime"
          :max="tracksStore.duration"
          hideDetails
          class="mx-4"
          data-testid="progress-slider"
        >
          <template #append>
            <span class="text-caption">{{ formatTime(tracksStore.currentTime) }}</span>
          </template>
        </v-slider>
        <v-slider
          v-model="tracksStore.volume"
          :max="100"
          hideDetails
          class="mx-4"
          data-testid="volume-slider"
        >
          <template #prepend>
            <v-icon :icon="tracksStore.volume > 0 ? 'mdi-volume-high' : 'mdi-volume-off'" />
          </template>
        </v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.global-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-color: var(--v-surface-base);
  border-top: 1px solid var(--v-border-color);
  z-index: 1000;
}
</style>
