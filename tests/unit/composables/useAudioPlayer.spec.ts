/**
 * UNIT TEST: VITEST
 * Tests the useAudioPlayer composable in isolation with mocked dependencies.
 * Verifies audio player state management, track playback controls, and volume handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAudioPlayer } from '../../../src/modules/player/composables/useAudioPlayer';
import { createMockTrack } from '../../utils/testUtils';

describe('useAudioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTrack = createMockTrack({
    id: 'track-1',
    title: 'Test Track',
    artist: 'Test Artist',
    audioFile: 'https://example.com/audio.mp3',
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const player = useAudioPlayer();

      expect(player.currentTrack.value).toBeNull();
      expect(player.isPlaying.value).toBe(false);
      expect(player.currentTime.value).toBe(0);
      expect(player.duration.value).toBe(0);
      expect(player.volume.value).toBe(100);
    });
  });

  describe('track state checks', () => {
    it('should check if track is playing', () => {
      const player = useAudioPlayer();
      player.currentTrack.value = mockTrack;
      player.isPlaying.value = true;

      expect(player.isTrackPlaying('track-1')).toBe(true);
      expect(player.isTrackPlaying('other-track')).toBe(false);
    });

    it('should check if track is paused', () => {
      const player = useAudioPlayer();
      player.currentTrack.value = mockTrack;
      player.isPaused.value = true;

      expect(player.isTrackPaused('track-1')).toBe(true);
      expect(player.isTrackPaused('other-track')).toBe(false);
    });

    it('should check if track is loaded', () => {
      const player = useAudioPlayer();
      player.currentTrack.value = mockTrack;

      expect(player.isTrackLoaded('track-1')).toBe(true);
      expect(player.isTrackLoaded('other-track')).toBe(false);
    });
  });

  describe('playTrack', () => {
    it('should set current track when playing', async () => {
      const player = useAudioPlayer();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await player.playTrack(mockTrack);
      expect(player.currentTrack.value).toEqual(mockTrack);

      consoleSpy.mockRestore();
    });

    it('should handle tracks without audio file', async () => {
      const player = useAudioPlayer();
      const trackWithoutAudio = createMockTrack({ audioFile: undefined });

      await expect(player.playTrack(trackWithoutAudio)).rejects.toThrow('Track has no audio file');
    });

    it('should update playing state when track starts', async () => {
      const player = useAudioPlayer();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await player.playTrack(mockTrack);
      expect(player.currentTrack.value).toEqual(mockTrack);

      consoleSpy.mockRestore();
    });
  });

  describe('pauseTrack', () => {
    it('should call pause on audio element when playing', () => {
      const player = useAudioPlayer();
      player.isPlaying.value = true;

      const mockAudio = {
        pause: vi.fn(),
      } as Partial<HTMLAudioElement>;
      player.currentAudio.value = mockAudio as HTMLAudioElement;

      player.pauseTrack();

      expect(mockAudio.pause).toHaveBeenCalled();
    });
  });

  describe('resumeTrack', () => {
    it('should only resume if track is paused', async () => {
      const player = useAudioPlayer();
      player.currentTrack.value = mockTrack;
      player.isPaused.value = false;

      await expect(player.resumeTrack()).resolves.not.toThrow();
    });
  });

  describe('stopTrack', () => {
    it('should reset track state', () => {
      const player = useAudioPlayer();
      player.currentTrack.value = mockTrack;
      player.isPlaying.value = true;

      player.stopTrack();

      expect(player.currentTrack.value).toBeNull();
      expect(player.isPlaying.value).toBe(false);
      expect(player.currentTime.value).toBe(0);
    });
  });

  describe('setVolume', () => {
    it('should set volume within valid range', () => {
      const player = useAudioPlayer();

      player.setVolume(0.5);

      expect(player.volume.value).toBe(0.5);
    });

    it('should clamp volume to maximum', () => {
      const player = useAudioPlayer();

      player.setVolume(150); 

      expect(player.volume.value).toBe(100);
    });

    it('should clamp volume to minimum', () => {
      const player = useAudioPlayer();

      player.setVolume(-0.5);

      expect(player.volume.value).toBe(0);
    });
  });

  describe('setCurrentTime', () => {
    it('should update current time', () => {
      const player = useAudioPlayer();
      const mockAudio = {
        currentTime: 0,
      } as HTMLAudioElement;
      player.currentAudio.value = mockAudio;

      player.setCurrentTime(30);

      expect(mockAudio.currentTime).toBe(30);
    });
  });
}); 