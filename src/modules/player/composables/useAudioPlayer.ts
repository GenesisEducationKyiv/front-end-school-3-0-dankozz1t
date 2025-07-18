import { ref, watch, type Ref } from 'vue';
import type { Track } from '../../track/types';
import type { PlayerEvents } from '../types';

export function useAudioPlayer(events?: PlayerEvents) {
  // === STATE ===
  const currentTrack = ref<Track | null>(null);
  const currentAudio = ref<HTMLAudioElement | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const volume = ref<number>(100);
  const loading = ref<boolean>(false);
  const isPlaying = ref<boolean>(false);
  const isPaused = ref<boolean>(false);

  // === AUDIO SETUP ===

  const setupAudioPlayer = (audio: HTMLAudioElement): void => {
    audio.volume = volume.value / 100;

    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime;
      events?.onTimeUpdate?.(audio.currentTime, audio.duration);
    });

    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration;
    });

    audio.addEventListener('ended', () => {
      const track = currentTrack.value;
      stopTrack();
      if (track) {
        events?.onTrackEnd?.(track);
      }
    });

    audio.addEventListener('play', () => {
      isPlaying.value = true;
      isPaused.value = false;
      if (currentTrack.value) {
        events?.onTrackStart?.(currentTrack.value);
      }
    });

    audio.addEventListener('pause', () => {
      isPlaying.value = false;
      isPaused.value = true;
      if (currentTrack.value) {
        events?.onTrackPause?.(currentTrack.value);
      }
    });

    audio.addEventListener('error', error => {
      console.error('Audio playback error:', error);
      stopTrack();
      events?.onError?.(new Error('Audio playback failed'));
    });

    // Update volume when changed
    watch(
      volume,
      newVolume => {
        if (currentAudio.value) {
          currentAudio.value.volume = newVolume / 100;
          events?.onVolumeChange?.(newVolume);
        }
      },
      { immediate: false }
    );
  };

  // === PLAYER METHODS ===
  async function playTrack(track: Track): Promise<void> {
    // If another track is playing, stop it first
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
    }

    if (!track.audioFile) {
      throw new Error('Track has no audio file');
    }

    currentTrack.value = track;
    loading.value = true;

    try {
      const audioUrl = `${import.meta.env['VITE_API_BASE_URL']}/api/files/${track.audioFile}`;
      currentAudio.value = new Audio(audioUrl);
      setupAudioPlayer(currentAudio.value);

      await currentAudio.value.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      stopTrack();
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function resumeTrack(): Promise<void> {
    if (currentAudio.value && isPaused.value) {
      await currentAudio.value.play();
      if (currentTrack.value) {
        events?.onTrackResume?.(currentTrack.value);
      }
    }
  }

  function pauseTrack(): void {
    if (currentAudio.value && isPlaying.value) {
      currentAudio.value.pause();
    }
  }

  function stopTrack(): void {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
    }
    currentTrack.value = null;
    currentTime.value = 0;
    duration.value = 0;
    isPlaying.value = false;
    isPaused.value = false;
    loading.value = false;
  }

  function setCurrentTime(time: number): void {
    if (currentAudio.value) {
      currentAudio.value.currentTime = time;
    }
  }

  function setVolume(newVolume: number): void {
    volume.value = Math.max(0, Math.min(100, newVolume));
  }

  function isTrackPlaying(trackId: string): boolean {
    return !!currentTrack.value && currentTrack.value.id === trackId && isPlaying.value;
  }

  function isTrackPaused(trackId: string): boolean {
    return !!currentTrack.value && currentTrack.value.id === trackId && isPaused.value;
  }

  function isTrackLoaded(trackId: string): boolean {
    return !!currentTrack.value && currentTrack.value.id === trackId;
  }

  return {
    // State
    currentTrack: currentTrack as Ref<Track | null>,
    currentAudio: currentAudio,
    currentTime: currentTime,
    duration: duration,
    volume: volume,
    loading: loading,
    isPlaying: isPlaying,
    isPaused: isPaused,

    // Methods
    playTrack,
    resumeTrack,
    pauseTrack,
    stopTrack,
    setCurrentTime,
    setVolume,
    isTrackPlaying,
    isTrackPaused,
    isTrackLoaded,
  };
}
