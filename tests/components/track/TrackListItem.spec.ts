/**
 * COMPONENT TEST: VITEST + VUE TEST UTILS
 * Tests the TrackListItem component with mocked store dependencies and Vuetify stubs.
 * Verifies track display, playback controls, bulk selection, and action buttons functionality.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TrackListItem from '../../../src/modules/track/components/TrackListItem.vue';
import { useTrackStore } from '../../../src/modules/track/store/trackStore';
import { usePlayerStore } from '../../../src/modules/player/store/playerStore';
import type { Track } from '../../../src/modules/track/types';

vi.mock('../../../src/modules/track/store/trackStore');
vi.mock('../../../src/modules/player/store/playerStore');
vi.mock('../../../src/shared/modules/modalsPool/store/modalsPool', () => ({
  useModalsPool: vi.fn(() => ({
    addVisibleItem: vi.fn(),
  })),
}));

import { createMockTrack, createMockTrackStore, createMockPlayerStore,  vuetifyStubs } from '../../utils/testUtils';


interface MountComponentProps {
  track?: Track;
  bulkSelectMode?: boolean;
  selected?: boolean;
}

describe('TrackListItem', () => {
  let pinia: ReturnType<typeof createPinia>;
  let mockTrackStore: ReturnType<typeof createMockTrackStore>;
  let mockPlayerStore: ReturnType<typeof createMockPlayerStore>;

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

    mockTrackStore = createMockTrackStore();
    mockPlayerStore = createMockPlayerStore();

    vi.mocked(useTrackStore).mockReturnValue(mockTrackStore);
    vi.mocked(usePlayerStore).mockReturnValue(mockPlayerStore);
  });

  const mountComponent = (props: MountComponentProps = {}) => {
    return mount(TrackListItem, {
      props: {
        track: mockTrack,
        ...props,
      },
      global: {
        plugins: [pinia],
        stubs: {
          ...vuetifyStubs,
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
      expect(chips[0]?.text()).toBe('Rock');
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
      const trackWithAudio = { ...mockTrack, audioFile: 'https://example.com/audio.mp3' };
      const wrapper = mountComponent({ track: trackWithAudio });

      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      expect(playButton.exists()).toBe(true);
    });

    it('should show pause button when track is playing', () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const trackWithAudio = { ...mockTrack, audioFile: 'https://example.com/audio.mp3' };
      const wrapper = mountComponent({ track: trackWithAudio });

      const pauseButton = wrapper.find(`[data-testid="pause-button-${mockTrack.id}"]`);
      expect(pauseButton.exists()).toBe(true);
    });

    it('should call playTrack when play button is clicked', async () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(false);
      const trackWithAudio = { ...mockTrack, audioFile: 'https://example.com/audio.mp3' };
      const wrapper = mountComponent({ track: trackWithAudio });

      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      await playButton.trigger('click');

      expect(mockPlayerStore.playTrack).toHaveBeenCalledWith(trackWithAudio);
    });

    it('should call pauseTrack when pause button is clicked', async () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const trackWithAudio = { ...mockTrack, audioFile: 'https://example.com/audio.mp3' };
      const wrapper = mountComponent({ track: trackWithAudio });

      const pauseButton = wrapper.find(`[data-testid="pause-button-${mockTrack.id}"]`);
      await pauseButton.trigger('click');

      expect(mockPlayerStore.pauseTrack).toHaveBeenCalled();
    });

    it('should show progress indicator when track is playing', () => {
      mockPlayerStore.isTrackPlaying.mockReturnValue(true);
      const trackWithAudio = { ...mockTrack, audioFile: 'https://example.com/audio.mp3' };
      const wrapper = mountComponent({ track: trackWithAudio });

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

      const playButton = wrapper.find(`[data-testid="play-button-${mockTrack.id}"]`);
      expect(playButton.exists()).toBe(false);
    });
  });
}); 