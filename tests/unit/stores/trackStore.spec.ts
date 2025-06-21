/**
 * UNIT TEST: VITEST - PINIA STORE
 * Tests the trackStore Pinia store with mocked dependencies and composables.
 * Verifies store state management, actions, computed properties, and API integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTrackStore } from '../../../src/modules/track/store/trackStore';

vi.mock('../../../src/modules/track/api/trackApi', () => ({
  trackApi: {
    getAllTracks: vi.fn(),
    createTrack: vi.fn(),
    updateTrack: vi.fn(),
    deleteTrack: vi.fn(),
    deleteTracks: vi.fn(),
    uploadTrackFile: vi.fn(),
    deleteTrackFile: vi.fn(),
  },
}));

vi.mock('../../../src/modules/track/composables/useTrackQueries', () => ({
  useTrackQueries: () => ({
    searchQuery: { value: '' },
    selectedGenre: { value: null },
    selectedArtist: { value: null },
    sortBy: { value: 'createdAt' },
    sortOrder: { value: 'desc' },
    currentPage: { value: 1 },
    itemsPerPage: { value: 20 },
    buildQueryParams: vi.fn(() => ({})),
    updateSearchQuery: vi.fn(),
    updateGenreFilter: vi.fn(),
    updateArtistFilter: vi.fn(),
    updateSorting: vi.fn(),
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
    updateItemsPerPage: vi.fn(),
    resetFilters: vi.fn(),
    setFilters: vi.fn(),
  }),
}));

vi.mock('../../../src/modules/track/composables/useTrackSelection', () => ({
  useTrackSelection: () => ({
    selectedTracks: { value: [] },
    isInBulkMode: { value: false },
    selectedCount: { value: 0 },
    toggleTrackSelection: vi.fn(),
    isTrackSelected: vi.fn(),
    selectAllTracks: vi.fn(),
    clearSelectedTracks: vi.fn(),
    selectTracks: vi.fn(),
    addToSelection: vi.fn(),
    removeFromSelection: vi.fn(),
  }),
}));

vi.mock('../../../src/modules/track/composables/useUrlFilters', () => ({
  useUrlFilters: () => ({
    initializeFromUrl: vi.fn(() => ({})),
    updateUrl: vi.fn(),
    updateUrlDebounced: vi.fn(),
    clearUrl: vi.fn(),
    isInitialized: { value: true },
  }),
}));

vi.mock('../../../src/shared/composables/useDebounce', () => ({
  useDebounce: (initialValue: any) => ({
    value: { value: initialValue },
    debouncedValue: { value: initialValue },
  }),
}));

import { 
  createMockTrack, 
  createMockTrackFormData, 
} from '../../utils/testUtils';

describe('useTrackStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with correct default state', () => {
      const store: any = useTrackStore();

      expect(store.tracks).toEqual([]);
      expect(store.totalTracks).toBe(0);
      expect(store.loading).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should compute totalPages correctly', () => {
      const store: any = useTrackStore();
      store.totalTracks = 85;

      expect(store.totalPages).toBe(5);
    });
  });

  describe('actions', () => {
    it('should fetch tracks successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const mockTracks = [createMockTrack(), createMockTrack({ id: 'track-2', title: 'Track 2' })];
      const mockResponse = {
        data: mockTracks,
        meta: {
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce(mockResponse);

      const store: any = useTrackStore();
      await store.fetchTracks();

      expect(store.tracks).toEqual(mockTracks);
      expect(store.totalTracks).toBe(2);
      expect(store.loading).toBe(false);
    });

    it('should handle fetch tracks error', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const error = new Error('Network error');

      vi.mocked(trackApi.getAllTracks).mockRejectedValueOnce(error);

      const store: any = useTrackStore();

      await expect(store.fetchTracks()).rejects.toThrow('Network error');
      expect(store.loading).toBe(false);
    });

    it('should create track successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const trackData = createMockTrackFormData();
      const newTrack = createMockTrack();

      vi.mocked(trackApi.createTrack).mockResolvedValueOnce(newTrack);
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [newTrack],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const store: any = useTrackStore();
      const result = await store.createTrack(trackData);

      expect(result).toEqual(newTrack);
      expect(trackApi.createTrack).toHaveBeenCalledWith(trackData);
    });

    it('should update track successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const existingTrack = createMockTrack();
      const updatedTrack = { ...existingTrack, title: 'Updated Title' };

      vi.mocked(trackApi.updateTrack).mockResolvedValueOnce(updatedTrack);
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [updatedTrack],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const store: any = useTrackStore();
      const result = await store.updateTrack(existingTrack.id, { title: 'Updated Title' });

      expect(result).toEqual(updatedTrack);
      expect(trackApi.updateTrack).toHaveBeenCalledWith(existingTrack.id, {
        title: 'Updated Title',
      });
    });

    it('should delete track successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');

      vi.mocked(trackApi.deleteTrack).mockResolvedValueOnce(undefined);
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      const store: any = useTrackStore();
      await store.deleteTrack('track-1');

      expect(trackApi.deleteTrack).toHaveBeenCalledWith('track-1');
      expect(trackApi.getAllTracks).toHaveBeenCalled();
    });

    it('should delete multiple tracks successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');

      vi.mocked(trackApi.deleteTracks).mockResolvedValueOnce({
        success: ['track-1', 'track-2'],
        failed: [],
      });
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      const store: any = useTrackStore();
      await store.deleteTracks(['track-1', 'track-2']);

      expect(trackApi.deleteTracks).toHaveBeenCalledWith(['track-1', 'track-2']);
    });

    it('should upload track file successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const file = new File(['audio'], 'song.mp3', { type: 'audio/mpeg' });
      const updatedTrack = createMockTrack({ audioFile: 'https://example.com/song.mp3' });

      vi.mocked(trackApi.uploadTrackFile).mockResolvedValueOnce(updatedTrack);
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [updatedTrack],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const store: any = useTrackStore();
      const result = await store.uploadTrackFile('track-1', file);

      expect(result).toEqual(updatedTrack);
      expect(trackApi.uploadTrackFile).toHaveBeenCalledWith('track-1', file);
    });

    it('should delete track file successfully', async () => {
      const { trackApi } = await import('../../../src/modules/track/api/trackApi');
      const updatedTrack = createMockTrack({ audioFile: undefined });

      vi.mocked(trackApi.deleteTrackFile).mockResolvedValueOnce(updatedTrack);
      vi.mocked(trackApi.getAllTracks).mockResolvedValueOnce({
        data: [updatedTrack],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const store: any = useTrackStore();
      const result = await store.deleteTrackFile('track-1');

      expect(result).toEqual(updatedTrack);
      expect(trackApi.deleteTrackFile).toHaveBeenCalledWith('track-1');
    });
  });
}); 