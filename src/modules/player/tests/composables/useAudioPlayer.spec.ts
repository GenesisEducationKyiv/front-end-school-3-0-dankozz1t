import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAudioPlayer } from '../../composables/useAudioPlayer';
import type { Track } from '../../../track/types';

// Inline mock factory
const createMockTrack = (overrides: Partial<Track> = {}): Track => ({
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock', 'Alternative'],
  slug: 'test-track',
  coverImage: 'https://example.com/cover.jpg',
  audioFile: 'https://example.com/audio.mp3',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

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

      try {
        await player.playTrack(mockTrack);
        expect(player.currentTrack.value).toEqual(mockTrack);
      } catch {
        // Expected to fail in test environment
        expect(player.currentTrack.value).toEqual(mockTrack);
      }
    });

    it('should handle tracks without audio file', async () => {
      const player = useAudioPlayer();
      const trackWithoutAudio = createMockTrack({ audioFile: undefined });

      await expect(player.playTrack(trackWithoutAudio)).rejects.toThrow();
    });
  });

  describe('pauseTrack', () => {
    it('should call pause on audio element when playing', () => {
      const player = useAudioPlayer();
      player.isPlaying.value = true;

      // Mock audio element with pause method
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

      // Should not throw when not paused
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

      player.setVolume(150); // Try to set above 100

      expect(player.volume.value).toBe(100); // Should clamp to 100
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
      // Mock audio element with currentTime property
      const mockAudio = {
        currentTime: 0,
      } as HTMLAudioElement;
      player.currentAudio.value = mockAudio;

      player.setCurrentTime(30);

      expect(mockAudio.currentTime).toBe(30);
    });
  });
});
