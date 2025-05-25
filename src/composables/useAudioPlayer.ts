import { ref, watch } from 'vue';
import { type Track } from '@/services/tracks';

export function useAudioPlayer() {
  const currentTrack = ref<Track | null>(null);
  const currentAudio = ref<HTMLAudioElement | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const volume = ref<number>(100);
  const loading = ref<boolean>(false);

  /**
   * Sets up audio player event listeners
   */
  const setupAudioPlayer = (audio: HTMLAudioElement): void => {
    audio.volume = volume.value / 100;

    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime;
    });

    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration;
    });

    audio.addEventListener('ended', () => {
      stopTrack();
    });

    // Update volume when changed
    watch(volume, newVolume => {
      if (currentAudio.value) {
        currentAudio.value.volume = newVolume / 100;
      }
    });
  };

  /**
   * Play an audio track
   * @param track - Track to play
   */
  async function playTrack(track: Track): Promise<void> {
    // If another track is playing, stop it first
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
    }

    if (track.audioFile) {
      currentTrack.value = track;

      loading.value = true;
      try {
        const audioUrl = `${import.meta.env.VITE_API_BASE_URL}/api/files/${track.audioFile}`;
        currentAudio.value = new Audio(audioUrl);
        setupAudioPlayer(currentAudio.value);

        currentAudio.value.onerror = () => {
          console.error('Audio playback error');
          stopTrack();
        };

        await currentAudio.value.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        stopTrack();
      } finally {
        loading.value = false;
      }
    }
  }

  /**
   * Stop the currently playing track
   */
  function stopTrack(): void {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
      currentTrack.value = null;
      currentTime.value = 0;
      duration.value = 0;
    }
  }

  /**
   * Check if a specific track is currently playing
   * @param trackId - ID of the track to check
   */
  function isTrackPlaying(trackId: string): boolean {
    return !!currentTrack.value && currentTrack.value.id === trackId && !!currentAudio.value;
  }

  /**
   * Set the current playback time
   * @param time - Time in seconds
   */
  function setCurrentTime(time: number): void {
    if (currentAudio.value) {
      currentAudio.value.currentTime = time;
    }
  }

  return {
    currentTrack,
    currentAudio,
    currentTime,
    duration,
    volume,
    loading,
    playTrack,
    stopTrack,
    isTrackPlaying,
    setCurrentTime,
  };
}
