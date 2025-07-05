import { computed, type ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { useAudioPlayer } from '@/modules/player/composables/useAudioPlayer';
import type { Track } from '@/modules/track/types';

export const usePlayerStore = defineStore('player', () => {
  // === COMPOSABLE ===
  const audioPlayer = useAudioPlayer();

  // === COMPUTED ===

  const hasAudioLoaded: ComputedRef<boolean> = computed(() => !!audioPlayer.currentTrack.value);

  // === ACTIONS ===

  async function playTrack(track: Track): Promise<void> {
    await audioPlayer.playTrack(track);
  }

  async function resumeTrack(): Promise<void> {
    await audioPlayer.resumeTrack();
  }

  function pauseTrack(): void {
    audioPlayer.pauseTrack();
  }

  function stopTrack(): void {
    audioPlayer.stopTrack();
  }

  async function togglePlayPause(): Promise<void> {
    if (audioPlayer.isPlaying.value) {
      pauseTrack();
    } else if (audioPlayer.isPaused.value) {
      await resumeTrack();
    }
  }

  function seekTo(time: number): void {
    audioPlayer.setCurrentTime(time);
  }

  function setVolume(volume: number): void {
    audioPlayer.setVolume(volume);
  }

  return {
    // State from composable
    currentTrack: audioPlayer.currentTrack,
    currentAudio: audioPlayer.currentAudio,
    currentTime: audioPlayer.currentTime,
    duration: audioPlayer.duration,
    volume: audioPlayer.volume,
    loading: audioPlayer.loading,
    isPlaying: audioPlayer.isPlaying,
    isPaused: audioPlayer.isPaused,

    // Computed
    hasAudioLoaded,

    // Methods from composable
    isTrackPlaying: audioPlayer.isTrackPlaying,
    isTrackPaused: audioPlayer.isTrackPaused,
    isTrackLoaded: audioPlayer.isTrackLoaded,

    // Actions
    playTrack,
    resumeTrack,
    pauseTrack,
    stopTrack,
    togglePlayPause,
    seekTo,
    setVolume,
  };
});
