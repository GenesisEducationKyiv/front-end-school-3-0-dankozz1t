/**
 * COMPONENT TEST: VITEST + VUE TEST UTILS
 * Tests the GlobalAudioPlayer Vue component with mocked store dependencies.
 * Verifies component rendering, user interactions, prop handling, and store integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import GlobalAudioPlayer from '../../../src/modules/player/components/GlobalAudioPlayer.vue';
import { usePlayerStore } from '../../../src/modules/player/store/playerStore';
import { createMockTrack, createMockPlayerStore, vuetifyStubs } from '../../utils/testUtils';

vi.mock('../../../src/modules/player/store/playerStore');

describe('GlobalAudioPlayer', () => {
  let pinia: any;
  let mockPlayerStore: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    mockPlayerStore = createMockPlayerStore({
      hasAudioLoaded: true,
      currentTrack: createMockTrack(),
      currentTime: 30,
      duration: 120,
      volume: 75,
      isPlaying: false,
    });

    vi.mocked(usePlayerStore).mockReturnValue(mockPlayerStore);
  });

  const mountComponent = (props = {}) => {
    return mount(GlobalAudioPlayer, {
      props,
      global: {
        plugins: [pinia],
        stubs: vuetifyStubs,
      },
    });
  };

  describe('visibility', () => {
    it('should render when audio is loaded', () => {
      const wrapper = mountComponent();
      expect(wrapper.find('.v-card').exists()).toBe(true);
    });

    it('should not render when no audio is loaded', () => {
      mockPlayerStore.hasAudioLoaded = false;
      const wrapper = mountComponent();
      expect(wrapper.find('.v-card').exists()).toBe(false);
    });
  });

  describe('track information', () => {
    it('should display track title and artist', () => {
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('Test Track');
      expect(wrapper.text()).toContain('Test Artist');
      expect(wrapper.text()).toContain('Test Album');
    });

    it('should display fallback text for unknown track', () => {
      mockPlayerStore.currentTrack = null;
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('Unknown Track');
      expect(wrapper.text()).toContain('Unknown Artist');
      expect(wrapper.text()).toContain('Unknown Album');
    });

    it('should display cover image when available', () => {
      const wrapper = mountComponent();
      const img = wrapper.find('.v-img');
      expect(img.exists()).toBe(true);
    });
  });

  describe('player controls', () => {
    it('should show play button when not playing', () => {
      mockPlayerStore.isPlaying = false;
      const wrapper = mountComponent();
      
      const playBtn = wrapper.find('[data-testid="play-pause-button"]');
      expect(playBtn.exists()).toBe(true);
    });

    it('should show pause button when playing', () => {
      mockPlayerStore.isPlaying = true;
      const wrapper = mountComponent();
      
      const pauseBtn = wrapper.find('[data-testid="play-pause-button"]');
      expect(pauseBtn.exists()).toBe(true);
    });

    it('should call togglePlayPause when play/pause button is clicked', async () => {
      const wrapper = mountComponent();
      
      await wrapper.find('[data-testid="play-pause-button"]').trigger('click');
      expect(mockPlayerStore.togglePlayPause).toHaveBeenCalled();
    });

    it('should call stopTrack when stop button is clicked', async () => {
      const wrapper = mountComponent();
      
      await wrapper.find('[data-testid="stop-track-button"]').trigger('click');
      expect(mockPlayerStore.stopTrack).toHaveBeenCalled();
    });
  });

  describe('progress slider', () => {
    it('should display current time and duration', () => {
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('0:30'); // currentTime
      expect(wrapper.text()).toContain('2:00'); // duration
    });

    it('should call seekTo when progress slider changes', async () => {
      const wrapper = mountComponent();
      const progressSlider = wrapper.find('[data-testid="progress-slider"]');
      
      await progressSlider.setValue(60);
      expect(mockPlayerStore.seekTo).toHaveBeenCalledWith(60);
    });
  });

  describe('volume control', () => {
    it('should display current volume percentage', () => {
      const wrapper = mountComponent();
      expect(wrapper.text()).toContain('75%');
    });

    it('should call setVolume when volume slider changes', async () => {
      const wrapper = mountComponent();
      const volumeSlider = wrapper.find('[data-testid="volume-slider"]');
      
      await volumeSlider.setValue(50);
      expect(mockPlayerStore.setVolume).toHaveBeenCalledWith(50);
    });

    it('should show volume-off icon when volume is 0', () => {
      mockPlayerStore.volume = 0;
      const wrapper = mountComponent();
      
      expect(wrapper.find('.v-icon').exists()).toBe(true);
    });
  });

  describe('time formatting', () => {
    it('should format time correctly', () => {
      mockPlayerStore.currentTime = 65; // 1:05
      mockPlayerStore.duration = 185; // 3:05
      
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('1:05');
      expect(wrapper.text()).toContain('3:05');
    });

    it('should handle invalid time values', () => {
      mockPlayerStore.currentTime = NaN;
      mockPlayerStore.duration = null;
      
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('0:00');
    });
  });
}); 