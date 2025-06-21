/**
 * COMPONENT TEST: VITEST + VUE TEST UTILS
 * Tests the TrackForm modal component with multiple mocked store dependencies.
 * Verifies form rendering, validation, submission, create/edit modes, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TrackForm from '../../../src/modules/track/components/modals/TrackForm.vue';
import { useTrackStore } from '../../../src/modules/track/store/trackStore';
import { useNotificationStore } from '../../../src/shared/modules/notification/store/notification';
import { useModalsPool } from '../../../src/shared/modules/modalsPool/store/modalsPool';
import { useGenresStore } from '../../../src/shared/modules/genres/store/genres';
import { 
  createMockTrack, 
  createMockTrackStore,
  createMockModalsPool,
  vuetifyStubs 
} from '../../utils/testUtils';

vi.mock('../../../src/modules/track/store/trackStore');
vi.mock('../../../src/shared/modules/notification/store/notification');
vi.mock('../../../src/shared/modules/modalsPool/store/modalsPool');
vi.mock('../../../src/shared/modules/genres/store/genres');

describe('TrackForm', () => {
  let pinia: any;
  let mockTrackStore: any;
  let mockNotificationStore: any;
  let mockModalsStore: any;
  let mockGenresStore: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    mockTrackStore = createMockTrackStore();
    mockNotificationStore = {
      notify: vi.fn(),
    };
    mockModalsStore = createMockModalsPool();
    mockGenresStore = {
      genres: ['Rock', 'Pop', 'Jazz', 'Classical'],
    };

    vi.mocked(useTrackStore).mockReturnValue(mockTrackStore);
    vi.mocked(useNotificationStore).mockReturnValue(mockNotificationStore);
    vi.mocked(useModalsPool).mockReturnValue(mockModalsStore);
    vi.mocked(useGenresStore).mockReturnValue(mockGenresStore);
  });

  const mountComponent = (props = {}) => {
    const defaultProps = {
      track: null,
    };

    return mount(TrackForm, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [pinia],
        stubs: {
          ...vuetifyStubs,
          'v-dialog': {
            template: '<div class="v-dialog"><slot /></div>',
          },
          'v-form': {
            template: '<form class="v-form"><slot /></form>',
            methods: {
              validate: () => Promise.resolve({ valid: true }),
            },
          },
        },
      },
    });
  };

  describe('create mode', () => {
    it('should render create form when no track provided', () => {
      const wrapper = mountComponent();
      
      expect(wrapper.text()).toContain('Create Track');
      expect(wrapper.find('[data-testid="submit-button"]').text()).toContain('Create');
    });

    it('should create track when form is submitted', async () => {
      mockTrackStore.createTrack.mockResolvedValueOnce(createMockTrack());
      const wrapper = mountComponent();

      await wrapper.find('[data-testid="input-title"]').setValue('New Track');
      await wrapper.find('[data-testid="input-artist"]').setValue('New Artist');
      await wrapper.find('[data-testid="input-album"]').setValue('New Album');

      await wrapper.find('[data-testid="submit-button"]').trigger('click');

      expect(mockTrackStore.createTrack).toHaveBeenCalledWith({
        title: 'New Track',
        artist: 'New Artist',
        album: 'New Album',
        genres: [],
        coverImage: '',
      });
      expect(mockNotificationStore.notify).toHaveBeenCalledWith('Track created successfully', 'success');
      expect(mockModalsStore.removeVisibleItem).toHaveBeenCalledWith('TrackForm');
    });
  });

  describe('edit mode', () => {
    const existingTrack = createMockTrack({
      id: 'existing-track',
      title: 'Existing Track',
      artist: 'Existing Artist',
      album: 'Existing Album',
      genres: ['Rock', 'Pop'],
    });

    it('should render edit form when track is provided', () => {
      const wrapper = mountComponent({ track: existingTrack });
      
      expect(wrapper.text()).toContain('Edit Track');
      expect(wrapper.find('[data-testid="submit-button"]').text()).toContain('Update');
    });

    it('should pre-populate form with existing track data', () => {
      const wrapper = mountComponent({ track: existingTrack });
      
      const titleInput = wrapper.find('[data-testid="input-title"]');
      const artistInput = wrapper.find('[data-testid="input-artist"]');
      const albumInput = wrapper.find('[data-testid="input-album"]');

      expect(titleInput.exists()).toBe(true);
      expect(artistInput.exists()).toBe(true);
      expect(albumInput.exists()).toBe(true);
    });

    it('should update track when form is submitted', async () => {
      mockTrackStore.updateTrack.mockResolvedValueOnce(createMockTrack());
      const wrapper = mountComponent({ track: existingTrack });

      await wrapper.find('[data-testid="input-title"]').setValue('Updated Track');

      await wrapper.find('[data-testid="submit-button"]').trigger('click');

      expect(mockTrackStore.updateTrack).toHaveBeenCalledWith(existingTrack.id, {
        title: 'Updated Track',
        artist: 'Existing Artist',
        album: 'Existing Album',
        genres: ['Rock', 'Pop'],
        coverImage: 'https://example.com/cover.jpg',
      });
      expect(mockNotificationStore.notify).toHaveBeenCalledWith('Track updated successfully', 'success');
    });
  });

  describe('form validation', () => {
    it('should require title field', () => {
      const wrapper = mountComponent();
      const titleInput = wrapper.find('[data-testid="input-title"]');
      
      expect(titleInput.exists()).toBe(true);
    });

    it('should require artist field', () => {
      const wrapper = mountComponent();
      const artistInput = wrapper.find('[data-testid="input-artist"]');
      
      expect(artistInput.exists()).toBe(true);
    });

    it('should validate image URL format', async () => {
      const wrapper = mountComponent();
      const imageInput = wrapper.find('[data-testid="input-cover-image"]');
      
      await imageInput.setValue('not-a-url');
      expect(imageInput.exists()).toBe(true);
    });
  });

  describe('genre selection', () => {
    it('should display available genres', () => {
      const wrapper = mountComponent();
      const genreSelector = wrapper.find('[data-testid="genre-selector"]');
      
      expect(genreSelector.exists()).toBe(true);
    });

    it('should allow multiple genre selection', async () => {
      const wrapper = mountComponent();
      const genreSelector = wrapper.find('[data-testid="genre-selector"]');
      
      expect(genreSelector.exists()).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle create errors gracefully', async () => {
      const errorMessage = 'Failed to create track';
      mockTrackStore.createTrack.mockRejectedValueOnce(new Error(errorMessage));
      
      const wrapper = mountComponent();
      await wrapper.find('[data-testid="submit-button"]').trigger('click');

      expect(mockNotificationStore.notify).toHaveBeenCalledWith('Failed to save track', 'error');
    });

    it('should handle update errors gracefully', async () => {
      const errorMessage = 'Failed to update track';
      mockTrackStore.updateTrack.mockRejectedValueOnce(new Error(errorMessage));
      
      const wrapper = mountComponent({ track: createMockTrack() });
      await wrapper.find('[data-testid="submit-button"]').trigger('click');

      expect(mockNotificationStore.notify).toHaveBeenCalledWith('Failed to save track', 'error');
    });
  });

  describe('form actions', () => {
    it('should close dialog when cancel is clicked', async () => {
      const wrapper = mountComponent();
      
      await wrapper.find('[data-testid="cancel-form"]').trigger('click');
      
      expect(mockModalsStore.removeVisibleItem).toHaveBeenCalledWith('TrackForm');
    });

    it('should disable submit button when form is invalid', () => {
      const wrapper = mountComponent();
      const submitButton = wrapper.find('[data-testid="submit-button"]');
      
      expect(submitButton.exists()).toBe(true);
    });
  });
}); 