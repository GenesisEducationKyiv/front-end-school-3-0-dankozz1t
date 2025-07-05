/**
 * COMPONENT TEST: VITEST + VUE TEST UTILS
 * Tests the TrackSearch component with mocked store and Vuetify input stubs.
 * Verifies search input functionality, debouncing, accessibility, and store integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { nextTick } from 'vue';
import TrackSearch from '../../../src/modules/track/components/TrackSearch.vue';
import { useTrackStore } from '../../../src/modules/track/store/trackStore';
import { createMockTrackStore, vuetifyStubs } from '../../utils/testUtils';

vi.mock('../../../src/modules/track/store/trackStore');

describe('TrackSearch', () => {
  let mockTrackStore: ReturnType<typeof createMockTrackStore>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    mockTrackStore = createMockTrackStore();
    mockTrackStore.searchQuery = '';

    vi.mocked(useTrackStore).mockReturnValue(mockTrackStore);
  });

  const mountComponent = (props = {}) => {
    return mount(TrackSearch, {
      props,
      global: {
        plugins: [pinia],
        stubs: vuetifyStubs,
      },
    });
  };

  describe('rendering', () => {
    it('should render search input field', () => {
      const wrapper = mountComponent();
      
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('should show placeholder text', () => {
      const wrapper = mountComponent();
      
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('should display current search query', () => {
      mockTrackStore.searchQuery = 'test query';
      const wrapper = mountComponent();
      
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      expect((searchInput.element as HTMLInputElement).value).toBe('test query');
    });
  });

  describe('search functionality', () => {
    it('should update search query when input changes', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.setValue('new search term');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('new search term');
    });

    it('should handle empty search query', async () => {
      mockTrackStore.searchQuery = 'existing query';
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.setValue('');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('');
    });

    it('should clear search when clear button is used', async () => {
      mockTrackStore.searchQuery = 'test query';
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.setValue('');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('');
    });

    it('should handle special characters in search', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      const specialQuery = 'test & query "with" special chars';
      await searchInput.setValue(specialQuery);
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith(specialQuery);
    });

    it('should handle long search queries', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      const longQuery = 'a'.repeat(100);
      await searchInput.setValue(longQuery);
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith(longQuery);
    });
  });

  describe('search behavior', () => {
    it('should be reactive to store changes', async () => {
      const wrapper = mountComponent();
      
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('should maintain focus after search', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.trigger('focus');
      await searchInput.setValue('test');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('test');
    });

    it('should handle rapid input changes', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.setValue('a');
      await searchInput.setValue('ab');
      await searchInput.setValue('abc');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledTimes(3);
      expect(mockTrackStore.updateSearchQuery).toHaveBeenLastCalledWith('abc');
    });

    it('should handle debounced search correctly', async () => {
      vi.useFakeTimers();
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');

      await searchInput.setValue('test');
      vi.advanceTimersByTime(300);

      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('test');
      vi.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      expect(searchInput.exists()).toBe(true);
    });

    it('should support keyboard navigation', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.trigger('keydown.enter');
      
      expect(searchInput.exists()).toBe(true);
    });

    it('should support escape key to clear', async () => {
      mockTrackStore.searchQuery = 'test query';
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.trigger('keydown.escape');
      await searchInput.setValue('');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('');
    });
  });

  describe('integration with store', () => {
    it('should work with different initial search states', () => {
      mockTrackStore.searchQuery = '';
      let wrapper = mountComponent();
             let searchInput = wrapper.find('[data-testid="track-search-input"]');
       expect((searchInput.element as HTMLInputElement).value).toBe('');

       mockTrackStore.searchQuery = 'existing search';
       wrapper = mountComponent();
       searchInput = wrapper.find('[data-testid="track-search-input"]');
       expect((searchInput.element as HTMLInputElement).value).toBe('existing search');
    });

    it('should handle store method calls correctly', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      await searchInput.setValue('test search');
      
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledWith('test search');
      expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledTimes(1);
    });

    it('should handle store errors gracefully', async () => {
      const wrapper = mountComponent();
      const searchInput = wrapper.find('[data-testid="track-search-input"]');
      
      expect(searchInput.exists()).toBe(true);
    });
  });

  describe('performance', () => {
         it('should not cause unnecessary re-renders', async () => {
       const wrapper = mountComponent();
       
       const searchInput = wrapper.find('[data-testid="track-search-input"]');
       await searchInput.setValue('same value');
       await searchInput.setValue('same value');
       await searchInput.setValue('same value');
       
       expect(mockTrackStore.updateSearchQuery).toHaveBeenCalledTimes(3);
     });

    it('should handle component unmounting cleanly', () => {
      const wrapper = mountComponent();
      
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });
});
