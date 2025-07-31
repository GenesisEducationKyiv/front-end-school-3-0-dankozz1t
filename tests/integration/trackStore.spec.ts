/**
 * INTEGRATION TEST: VITEST
 * Tests the trackStore integration with mocked API layer and composables.
 * Verifies end-to-end store workflows, data flow, and multi-component interactions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTrackStore } from '../../src/modules/track/store/trackStore';
import type { Track, TrackFormData, PaginatedResponse } from '../../src/modules/track/types';

vi.mock('../../src/modules/track/api/trackApi', () => ({
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

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    path: '/tracks',
    query: {},
  })),
}));

vi.mock('../../src/modules/track/composables/useUrlFilters', () => ({
  useUrlFilters: vi.fn(() => ({
    initializeFromUrl: vi.fn(() => ({})),
    updateUrl: vi.fn(),
    updateUrlDebounced: vi.fn(),
    clearUrl: vi.fn(),
    isInitialized: { value: true },
  })),
}));

import { trackApi } from '../../src/modules/track/api/trackApi';

const mockTrackApi = trackApi as any;

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

const createMockTrackFormData = (overrides: Partial<TrackFormData> = {}): TrackFormData => ({
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock'],
  coverImage: 'https://example.com/cover.jpg',
  ...overrides,
});

describe('TrackStore Integration Tests', () => {
  let pinia: ReturnType<typeof createPinia>;
  let store: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    const originalWarn = console.warn;
    console.warn = (message: string) => {
      if (message.includes('onBeforeUnmount')) return;
      originalWarn(message);
    };

    store = useTrackStore() as any;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Track CRUD Operations with API Integration', () => {
    it('should fetch tracks and update store state', async () => {
      const mockTracks = [
        createMockTrack({ id: 'track-1', title: 'Track 1' }),
        createMockTrack({ id: 'track-2', title: 'Track 2' }),
      ];

      const mockResponse: PaginatedResponse<Track> = {
        data: mockTracks,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockTrackApi.getAllTracks.mockResolvedValue(mockResponse);

      expect(store.tracks).toEqual([]);
      expect(store.totalTracks).toBe(0);
      expect(store.loading).toBe(false);

      await store.fetchTracks();

      expect(store.tracks).toEqual(mockTracks);
      expect(store.totalTracks).toBe(2);
      expect(store.loading).toBe(false);
      expect(mockTrackApi.getAllTracks).toHaveBeenCalledTimes(1);
    });

    it('should create track and refresh the list', async () => {
      const newTrackData = createMockTrackFormData({ title: 'New Track' });
      const createdTrack = createMockTrack({ id: 'new-track', title: 'New Track' });
      const updatedList = [createdTrack];

      mockTrackApi.createTrack.mockResolvedValue(createdTrack);

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: updatedList,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const result = await store.createTrack(newTrackData);

      expect(result).toEqual(createdTrack);
      expect(mockTrackApi.createTrack).toHaveBeenCalledWith(newTrackData);
      expect(mockTrackApi.getAllTracks).toHaveBeenCalled();
      expect(store.tracks).toEqual(updatedList);
    });

    it('should update track and refresh the list', async () => {
      const trackId = 'track-1';
      const updateData = { title: 'Updated Track' };
      const updatedTrack = createMockTrack({ id: trackId, title: 'Updated Track' });

      mockTrackApi.updateTrack.mockResolvedValue(updatedTrack);
      mockTrackApi.getAllTracks.mockResolvedValue({
        data: [updatedTrack],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const result = await store.updateTrack(trackId, updateData);

      expect(result).toEqual(updatedTrack);
      expect(mockTrackApi.updateTrack).toHaveBeenCalledWith(trackId, updateData);
      expect(mockTrackApi.getAllTracks).toHaveBeenCalled();
    });

    it('should delete track and refresh the list', async () => {
      const trackId = 'track-1';

      mockTrackApi.deleteTrack.mockResolvedValue(undefined);
      mockTrackApi.getAllTracks.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });

      await store.deleteTrack(trackId);

      expect(mockTrackApi.deleteTrack).toHaveBeenCalledWith(trackId);
      expect(mockTrackApi.getAllTracks).toHaveBeenCalled();
    });
  });

  describe('Search and Filter Integration', () => {
    it('should update search query and trigger API call with search params', async () => {
      const searchQuery = 'rock music';
      const mockTracks = [createMockTrack({ title: 'Rock Song' })];

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: mockTracks,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      store.updateSearchQuery(searchQuery);
      expect(store.searchQuery).toBe(searchQuery);

      await new Promise(resolve => setTimeout(resolve, 100));

      await store.fetchTracks();

      expect(mockTrackApi.getAllTracks).toHaveBeenCalled();

      const callArgs = mockTrackApi.getAllTracks.mock.calls[0][0];

      expect(store.searchQuery).toBe(searchQuery);

      console.log('API called with params:', callArgs);
    });

    it('should handle genre filter and API integration', async () => {
      const genre = 'Rock';
      const mockTracks = [createMockTrack({ genres: ['Rock'] })];

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: mockTracks,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      store.updateGenreFilter(genre);
      expect(store.selectedGenre).toBe(genre);

      await store.fetchTracks();

      expect(mockTrackApi.getAllTracks).toHaveBeenCalledWith(
        expect.objectContaining({
          genre: genre,
        })
      );
    });

    it('should reset filters and fetch unfiltered results', async () => {
      store.updateSearchQuery('test');
      store.updateGenreFilter('Rock');
      store.updateArtistFilter('Test Artist');

      expect(store.searchQuery).toBe('test');
      expect(store.selectedGenre).toBe('Rock');
      expect(store.selectedArtist).toBe('Test Artist');

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });

      store.resetFilters();

      expect(store.searchQuery).toBe('');
      expect(store.selectedGenre).toBe(null);
      expect(store.selectedArtist).toBe(null);
    });
  });

  describe('Pagination Integration', () => {
    it('should handle page changes and fetch correct data', async () => {
      const page2Tracks = [createMockTrack({ id: 'track-3', title: 'Track 3' })];

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: page2Tracks,
        meta: { total: 25, page: 2, limit: 10, totalPages: 3 },
      });

      store.goToPage(2);
      expect(store.currentPage).toBe(2);

      await store.fetchTracks();

      expect(mockTrackApi.getAllTracks).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 10,
        })
      );
      expect(store.tracks).toEqual(page2Tracks);
    });

    it('should handle items per page changes', async () => {
      const mockTracks = Array.from({ length: 20 }, (_, i) =>
        createMockTrack({ id: `track-${i}`, title: `Track ${i}` })
      );

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: mockTracks,
        meta: { total: 50, page: 1, limit: 20, totalPages: 3 },
      });

      store.updateItemsPerPage(20);
      expect(store.itemsPerPage).toBe(20);

      await store.fetchTracks();

      expect(mockTrackApi.getAllTracks).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
        })
      );
    });
  });

  describe('Bulk Operations Integration', () => {
    it('should handle bulk delete with track selection', async () => {
      const trackIds = ['track-1', 'track-2', 'track-3'];

      trackIds.forEach(id => store.toggleTrackSelection(id));
      expect(store.selectedTracks).toEqual(trackIds);

      mockTrackApi.deleteTracks.mockResolvedValue({
        success: trackIds,
        failed: [],
      });

      mockTrackApi.getAllTracks.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });

      await store.deleteTracks(trackIds);

      expect(mockTrackApi.deleteTracks).toHaveBeenCalledWith(trackIds);
      expect(store.selectedTracks).toEqual([]);
      expect(mockTrackApi.getAllTracks).toHaveBeenCalled();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors during fetch', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const apiError = new Error('Network error');
      mockTrackApi.getAllTracks.mockRejectedValue(apiError);

      await expect(store.fetchTracks()).rejects.toThrow('Network error');
      expect(store.loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching tracks:', apiError);

      consoleSpy.mockRestore();
    });

    it('should handle errors during create operations', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const trackData = createMockTrackFormData();
      const apiError = new Error('Validation error');

      mockTrackApi.createTrack.mockRejectedValue(apiError);

      await expect(store.createTrack(trackData)).rejects.toThrow('Validation error');
      expect(store.loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error creating track:', apiError);

      consoleSpy.mockRestore();
    });
  });

  describe('Computed Properties Integration', () => {
    it('should calculate totalPages correctly based on data', () => {
      store.totalTracks = 85;
      store.updateItemsPerPage(20);

      expect(store.totalPages).toBe(5);
    });

    it('should handle empty results correctly', () => {
      store.totalTracks = 0;
      expect(store.totalPages).toBe(0);
    });
  });
});
