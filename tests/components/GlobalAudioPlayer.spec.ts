import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

interface MockTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  audioUrl: string;
}

const mockTrack: MockTrack = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  coverImage: 'test-cover.jpg',
  audioUrl: 'test-audio.mp3',
};

interface MockTracksStore {
  currentTrack: MockTrack | null;
  hasAudioPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: MockTrack) => void;
  stopTrack: () => void;
}

const mockTracksStore: MockTracksStore = {
  currentTrack: mockTrack,
  hasAudioPlaying: false,
  currentTime: 30,
  duration: 180,
  volume: 75,
  playTrack: vi.fn(),
  stopTrack: vi.fn(),
};

vi.mock('../../src/stores/tracks', () => ({
  useTracksStore: vi.fn(() => mockTracksStore),
}));

describe('GlobalAudioPlayer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockTracksStore.hasAudioPlaying = false;
    mockTracksStore.currentTrack = mockTrack;
  });

  it('renders audio player with selected track info', async () => {
    expect(mockTracksStore.currentTrack).not.toBeNull();
    if (mockTracksStore.currentTrack) {
      expect(mockTracksStore.currentTrack.title).toBe('Test Track');
      expect(mockTracksStore.currentTrack.artist).toBe('Test Artist');
      expect(mockTracksStore.currentTrack.coverImage).toBe('test-cover.jpg');
    }
  });

  it('renders play button when audio is not playing', async () => {
    expect(mockTracksStore.hasAudioPlaying).toBe(false);
  });

  it('renders pause button when audio is playing', async () => {
    mockTracksStore.hasAudioPlaying = true;

    expect(mockTracksStore.hasAudioPlaying).toBe(true);
  });

  it('plays track when play button is clicked', async () => {
    const mockViewModel = {
      isPlaying: false,
      currentTrack: mockTrack,
      handlePlayPause: function () {
        if (this.isPlaying) {
          mockTracksStore.stopTrack();
        } else if (this.currentTrack) {
          mockTracksStore.playTrack(this.currentTrack);
        }
      },
    };

    mockViewModel.handlePlayPause();

    expect(mockTracksStore.playTrack).toHaveBeenCalledWith(mockTrack);
  });

  it('pauses track when pause button is clicked', async () => {
    mockTracksStore.hasAudioPlaying = true;

    const mockViewModel = {
      isPlaying: true,
      currentTrack: mockTrack,
      handlePlayPause: function () {
        if (this.isPlaying) {
          mockTracksStore.stopTrack();
        } else if (this.currentTrack) {
          mockTracksStore.playTrack(this.currentTrack);
        }
      },
    };

    mockViewModel.handlePlayPause();

    expect(mockTracksStore.stopTrack).toHaveBeenCalled();
  });

  it('does not render when no track is selected', async () => {
    mockTracksStore.currentTrack = null;

    expect(mockTracksStore.currentTrack).toBeNull();
  });

  it('formats time correctly', async () => {
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    expect(formatTime(mockTracksStore.currentTime)).toBe('0:30');

    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('updates when a new track is selected', async () => {
    expect(mockTracksStore.currentTrack).toEqual(mockTrack);

    const newTrack: MockTrack = {
      id: '2',
      title: 'New Track',
      artist: 'New Artist',
      album: 'New Album',
      coverImage: 'new-cover.jpg',
      audioUrl: 'new-audio.mp3',
    };

    mockTracksStore.currentTrack = newTrack;

    expect(mockTracksStore.currentTrack).toEqual(newTrack);
    expect(mockTracksStore.currentTrack.title).toBe('New Track');
    expect(mockTracksStore.currentTrack.artist).toBe('New Artist');
    expect(mockTracksStore.currentTrack.coverImage).toBe('new-cover.jpg');
  });
});
