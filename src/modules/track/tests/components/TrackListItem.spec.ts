import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TrackListItem from '../../components/TrackListItem.vue';
import { useTrackStore } from '../../store/trackStore';
import { usePlayerStore } from '@/modules/player/store/playerStore';
import type { Track } from '../../types';

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

// Mock stores
vi.mock('../../store/trackStore');
vi.mock('@/modules/player/store/playerStore');
vi.mock('@/stores/modalsPool', () => ({
  useModalsPool: () => ({
    addVisibleItem: vi.fn(),
  }),
}));

describe('TrackListItem', () => {
  let pinia: ReturnType<typeof createPinia>;
  let mockTrackStore: any;
  let mockPlayerStore: any;

  const mockTrack = createMockTrack({
    id: 'track-1',
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['Rock'],
  });

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    mockTrackStore = {
      selectedTrackIds: [],
      isInBulkMode: false,
      toggleTrackSelection: vi.fn(),
      deleteTrack: vi.fn(),
      updateTrack: vi.fn(),
    };

    mockPlayerStore = {
      currentTrack: null,
      isPlaying: false,
      loading: false,
      playTrack: vi.fn(),
      pauseTrack: vi.fn(),
      resumeTrack: vi.fn(),
      isTrackPlaying: vi.fn(() => false),
      isTrackPaused: vi.fn(() => false),
      isTrackLoaded: vi.fn(() => false),
    };

    vi.mocked(useTrackStore).mockReturnValue(mockTrackStore as any);
    vi.mocked(usePlayerStore).mockReturnValue(mockPlayerStore as any);
  });

  const mountComponent = (props: any = {}) => {
    return mount(TrackListItem, {
      props: {
        track: mockTrack,
        ...props,
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-card': {
            template: '<div class="v-card"><slot /></div>',
          },
          'v-row': {
            template: '<div class="v-row"><slot /></div>',
          },
          'v-col': {
            template: '<div class="v-col"><slot /></div>',
          },
          'v-img': {
            template: '<div class="v-img"></div>',
          },
          'v-icon': {
            template: '<i class="v-icon"><slot /></i>',
          },
          'v-btn': {
            template:
              '<button class="v-btn" :data-testid="$attrs[\'data-testid\']" @click="$emit(\'click\')"><slot /></button>',
            inheritAttrs: false,
          },
          'v-chip': {
            template: '<span class="v-chip"><slot /></span>',
          },
          'v-checkbox': {
            template:
              '<input type="checkbox" class="v-checkbox" :data-testid="$attrs[\'data-testid\']" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
            inheritAttrs: false,
          },
          'v-progress-circular': {
            template: '<div class="v-progress-circular"></div>',
          },
          'v-progress-linear': {
            template: '<div class="v-progress-linear"></div>',
          },
        },
      },
    });
  };

  describe('rendering', () => {
    it('should render track information correctly', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Test Track');
      expect(wrapper.text()).toContain('Test Artist');
      expect(wrapper.text()).toContain('Test Album');
    });

    it('should render track cover image when available', () => {
      const wrapper = mountComponent({
        track: { ...mockTrack, coverImage: 'https://example.com/cover.jpg' },
      });

      const img = wrapper.find('.v-img');
      expect(img.exists()).toBe(true);
    });

    it('should render default icon when no cover image', () => {
      const wrapper = mountComponent({
        track: { ...mockTrack, coverImage: undefined },
      });

      const icon = wrapper.find('.v-icon');
      expect(icon.exists()).toBe(true);
    });

    it('should render genres as chips', () => {
      const wrapper = mountComponent();

      const chips = wrapper.findAll('.v-chip');
      expect(chips.length).toBe(1);
      expect(chips[0].text()).toBe('Rock');
    });
  });

  describe('bulk mode', () => {
    it('should show checkbox when in bulk mode', () => {
      const wrapper = mountComponent({ bulkSelectMode: true });

      const checkbox = wrapper.find(`[data-testid="track-checkbox-${mockTrack.id}"]`);
      expect(checkbox.exists()).toBe(true);
    });

    it('should hide checkbox when not in bulk mode', () => {
      const wrapper = mountComponent({ bulkSelectMode: false });

      const checkbox = wrapper.find(`[data-testid="track-checkbox-${mockTrack.id}"]`);
      expect(checkbox.exists()).toBe(false);
    });

    it('should toggle selection when checkbox is clicked', async () => {
      const wrapper = mountComponent({ bulkSelectMode: true });

      const checkbox = wrapper.find(`[data-testid="track-checkbox-${mockTrack.id}"]`);
      await checkbox.trigger('change');

      expect(mockTrackStore.toggleTrackSelection).toHaveBeenCalledWith('track-1');
    });
  });

  describe('playback controls', () => {
    it('should show play button when track is not playing', () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(false);
      const wrapper = mountComponent();

      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      expect(playButton.exists()).toBe(true);
    });

    it('should show pause button when track is playing', () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const wrapper = mountComponent();

      const pauseButton = wrapper.find(`[data-testid="pause-button-${mockTrack.id}"]`);
      expect(pauseButton.exists()).toBe(true);
    });

    it('should call playTrack when play button is clicked', async () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(false);
      const wrapper = mountComponent();

      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      await playButton.trigger('click');

      expect(mockPlayerStore.playTrack).toHaveBeenCalledWith(mockTrack);
    });

    it('should call pauseTrack when pause button is clicked', async () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const wrapper = mountComponent();

      const pauseButton = wrapper.find(`[data-testid="pause-button-${mockTrack.id}"]`);
      await pauseButton.trigger('click');

      expect(mockPlayerStore.pauseTrack).toHaveBeenCalled();
    });

    it('should show progress indicator when track is playing', () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const wrapper = mountComponent();

      const progress = wrapper.find(`[data-testid="audio-progress-${mockTrack.id}"]`);
      expect(progress.exists()).toBe(true);
    });
  });

  describe('track actions', () => {
    it('should have edit button when not in bulk mode', () => {
      const wrapper = mountComponent({ bulkSelectMode: false });

      const editButton = wrapper.find(`[data-testid="edit-track-${mockTrack.id}"]`);
      expect(editButton.exists()).toBe(true);
    });

    it('should have upload button when not in bulk mode', () => {
      const wrapper = mountComponent({ bulkSelectMode: false });

      const uploadButton = wrapper.find(`[data-testid="upload-track-${mockTrack.id}"]`);
      expect(uploadButton.exists()).toBe(true);
    });

    it('should have delete button when not in bulk mode', () => {
      const wrapper = mountComponent({ bulkSelectMode: false });

      const deleteButton = wrapper.find(`[data-testid="delete-track-${mockTrack.id}"]`);
      expect(deleteButton.exists()).toBe(true);
    });
  });

  describe('props validation', () => {
    it('should handle missing optional track properties', () => {
      const incompleteTrack = {
        id: 'track-1',
        title: 'Test Track',
        artist: 'Test Artist',
        genres: [],
        slug: 'test-track',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const wrapper = mountComponent({ track: incompleteTrack });

      expect(wrapper.text()).toContain('Test Track');
      expect(wrapper.text()).toContain('Test Artist');
    });

    it('should show "No Album" when album is missing', () => {
      const trackWithoutAlbum = { ...mockTrack, album: undefined };
      const wrapper = mountComponent({ track: trackWithoutAlbum });

      expect(wrapper.text()).toContain('No Album');
    });

    it('should handle tracks without audio file', () => {
      const trackWithoutAudio = { ...mockTrack, audioFile: undefined };
      const wrapper = mountComponent({ track: trackWithoutAudio });

      // Should not show player controls for tracks without audio file
      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      expect(playButton.exists()).toBe(false);
    });
  });
});
