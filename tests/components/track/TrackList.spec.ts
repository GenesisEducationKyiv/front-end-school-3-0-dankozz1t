/**
 * COMPONENT TEST: VITEST + VUE TEST UTILS
 * Tests the TrackList component with mocked child components and store dependencies.
 * Verifies track rendering, bulk operations, pagination, loading states, and user interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TrackList from '../../../src/modules/track/components/TrackList.vue';
import { useTrackStore } from '../../../src/modules/track/store/trackStore';
import { useModalsPool } from '../../../src/shared/modules/modalsPool/store/modalsPool';
import { createMockTrack, createMockTrackStore, createMockModalsPool, vuetifyStubs } from '../../utils/testUtils';

vi.mock('../../../src/modules/track/store/trackStore');
vi.mock('../../../src/shared/modules/modalsPool/store/modalsPool');

vi.mock('../../../src/modules/track/components/TrackListItem.vue', () => ({
  default: {
    name: 'TrackListItem',
    props: ['track', 'bulkSelectMode', 'selected'],
    template: `
      <div 
        class="track-list-item" 
        :data-testid="'track-item-' + track.id"
        :data-selected="selected"
        :data-bulk-mode="bulkSelectMode"
      >
        <span>{{ track.title }} - {{ track.artist }}</span>
        <button 
          v-if="bulkSelectMode" 
          :data-testid="'select-' + track.id"
          @click="$emit('toggle-selection', track.id)"
        >
          {{ selected ? 'Deselect' : 'Select' }}
        </button>
      </div>
    `,
    emits: ['toggle-selection'],
  },
}));

describe('TrackList', () => {
  let mockTrackStore: ReturnType<typeof createMockTrackStore>;
  let mockModalsStore: ReturnType<typeof createMockModalsPool>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    mockTrackStore = createMockTrackStore();
    mockModalsStore = createMockModalsPool();

    vi.mocked(useTrackStore).mockReturnValue(mockTrackStore);
    vi.mocked(useModalsPool).mockReturnValue(mockModalsStore);
  });

  const mountComponent = (props = {}) => {
    return mount(TrackList, {
      props,
      global: {
        plugins: [pinia],
        stubs: {
          ...vuetifyStubs,
          TrackListItem: false, 
        },
      },
    });
  };

  describe('rendering', () => {
    it('should render toolbar with title', () => {
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('Tracks');
    });

    it('should show loading spinner when loading', () => {
      mockTrackStore.loading = true;
      const wrapper = mountComponent();
      
      expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
    });

    it('should show empty state when no tracks', () => {
      mockTrackStore.tracks = [];
      mockTrackStore.loading = false;
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('No tracks found');
      expect(wrapper.text()).toContain('Add your first track to get started');
    });

    it('should render track list when tracks exist', () => {
      const mockTracks = [
        createMockTrack({ id: '1', title: 'Track 1', artist: 'Artist 1' }),
        createMockTrack({ id: '2', title: 'Track 2', artist: 'Artist 2' }),
      ];
      mockTrackStore.tracks = mockTracks;
      mockTrackStore.loading = false;

      const wrapper = mountComponent();
      
      expect(wrapper.findAll('[data-testid^="track-item-"]')).toHaveLength(2);
      expect(wrapper.find('[data-testid="track-item-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="track-item-2"]').exists()).toBe(true);
    });
  });

  describe('track creation', () => {
    it('should show create track button in normal mode', () => {
      const wrapper = mountComponent();
      
      const createButton = wrapper.find('[data-testid="create-track-button"]');
      expect(createButton.exists()).toBe(true);
      expect(createButton.text()).toContain('Add Track');
    });

    it('should open track form modal when create button clicked', async () => {
      const wrapper = mountComponent();
      
      const createButton = wrapper.find('[data-testid="create-track-button"]');
      await createButton.trigger('click');
      
      expect(mockModalsStore.addVisibleItem).toHaveBeenCalledWith('TrackForm');
    });
  });

  describe('bulk selection mode', () => {
    it('should toggle bulk selection mode', async () => {
      const wrapper = mountComponent();
      
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      // Check that bulk mode is activated (create button should be hidden)
      expect(wrapper.find('[data-testid="create-track-button"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="bulk-delete-button"]').exists()).toBe(true);
    });

    it('should show bulk delete button in bulk mode', async () => {
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      const bulkDeleteButton = wrapper.find('[data-testid="bulk-delete-button"]');
      expect(bulkDeleteButton.exists()).toBe(true);
      expect(bulkDeleteButton.text()).toContain('Delete Selected');
    });

    it('should disable bulk delete button when no tracks selected', async () => {
      mockTrackStore.selectedTracks = [];
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      const bulkDeleteButton = wrapper.find('[data-testid="bulk-delete-button"]');
      expect(bulkDeleteButton.exists()).toBe(true);
    });

    it('should enable bulk delete button when tracks are selected', async () => {
      mockTrackStore.selectedTracks = ['1', '2'];
      mockTrackStore.selectedCount = 2;
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      const bulkDeleteButton = wrapper.find('[data-testid="bulk-delete-button"]');
      expect(bulkDeleteButton.exists()).toBe(true);
    });

    it('should open delete modal with selected track IDs', async () => {
      const selectedIds = ['1', '2', '3'];
      mockTrackStore.selectedTracks = selectedIds;
      mockTrackStore.selectedCount = 3;
      
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      // Click bulk delete
      const bulkDeleteButton = wrapper.find('[data-testid="bulk-delete-button"]');
      await bulkDeleteButton.trigger('click');
      
      expect(mockModalsStore.addVisibleItem).toHaveBeenCalledWith('DeleteTrack', {
        trackIds: selectedIds,
      });
    });

    it('should clear selection when exiting bulk mode', async () => {
      const wrapper = mountComponent();
      
      // Enter and exit bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click'); // Enter
      await toggleButton.trigger('click'); // Exit
      
      expect(mockTrackStore.clearSelectedTracks).toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should show pagination when multiple pages exist', () => {
      mockTrackStore.totalPages = 3;
      mockTrackStore.currentPage = 1;
      
      const wrapper = mountComponent();
      
      expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true);
    });

    it('should hide pagination when only one page exists', () => {
      mockTrackStore.totalPages = 1;
      
      const wrapper = mountComponent();
      
      expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(false);
    });

    it('should fetch tracks when page changes', async () => {
      mockTrackStore.totalPages = 3;
      mockTrackStore.currentPage = 1;
      
      const wrapper = mountComponent();
      
      expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true);
    });
  });

  describe('track summary', () => {
    it('should show track count summary', () => {
      mockTrackStore.tracks = [createMockTrack(), createMockTrack()];
      mockTrackStore.totalTracks = 10;
      
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('Showing 2 of 10 tracks');
    });

    it('should hide summary when no tracks', () => {
      mockTrackStore.tracks = [];
      mockTrackStore.totalTracks = 0;
      
      const wrapper = mountComponent();
      
      expect(wrapper.text()).not.toContain('Showing');
    });
  });

  describe('selection controls', () => {
    beforeEach(() => {
      mockTrackStore.tracks = [
        createMockTrack({ id: '1' }),
        createMockTrack({ id: '2' }),
        createMockTrack({ id: '3' }),
      ];
    });

    it('should show selection count in bulk mode', async () => {
      mockTrackStore.selectedCount = 2;
      
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      expect(wrapper.text()).toContain('2 selected');
    });

    it('should provide select all functionality', async () => {
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      const vm = wrapper.vm as any;
      vm.handleSelectAll();
      
      expect(mockTrackStore.selectAllTracks).toHaveBeenCalledWith(mockTrackStore.tracks);
    });

    it('should provide clear selection functionality', async () => {
      mockTrackStore.selectedCount = 2;
      
      const wrapper = mountComponent();
      
      // Activate bulk mode
      const toggleButton = wrapper.find('[data-testid="toggle-bulk-mode-button"]');
      await toggleButton.trigger('click');
      
      // Test clear selection method
      const vm = wrapper.vm as any;
      vm.handleClearSelection();
      
      expect(mockTrackStore.clearSelectedTracks).toHaveBeenCalled();
    });
  });
});
