import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { O, pipe } from '@mobily/ts-belt';

import type { Track, TrackFormData } from '@/modules/track/types';
import { useTrackQueries } from '@/modules/track/composables/useTrackQueries';
import { useTrackSelection } from '@/modules/track/composables/useTrackSelection';
import { useUrlFilters, type UrlFilters } from '@/modules/track/composables/useUrlFilters';
import { useDebounce } from '@/shared/composables/useDebounce';
import { trackApi } from '@/modules/track/api/trackApi';

export const useTrackStore = defineStore('track', () => {
  // === STATE ===
  const tracks = ref<Track[]>([]);
  const totalTracks = ref<number>(0);
  const loading = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isInitializing = ref<boolean>(true);

  // === COMPOSABLES ===
  const trackQueries = useTrackQueries();
  const trackSelection = useTrackSelection();
  const urlFilters = useUrlFilters();

  const { value: searchInput, debouncedValue: debouncedSearch } = useDebounce('', 500);

  // === COMPUTED ===
  const totalPages: ComputedRef<number> = computed(() =>
    Math.ceil(totalTracks.value / trackQueries.itemsPerPage.value)
  );

  const buildUrlFilters = (): UrlFilters => {
    const filters: UrlFilters = {};

    pipe(
      debouncedSearch.value,
      search => (search.trim() !== '' ? O.Some(search.trim()) : O.None),
      O.map(search => {
        filters.search = search;
        return search;
      })
    );

    pipe(
      trackQueries.selectedGenre.value,
      O.fromNullable,
      O.map(genre => {
        filters.genre = genre;
        return genre;
      })
    );

    pipe(
      trackQueries.selectedArtist.value,
      O.fromNullable,
      O.map(artist => {
        filters.artist = artist;
        return artist;
      })
    );

    pipe(
      trackQueries.sortBy.value,
      sortBy => (sortBy !== 'createdAt' ? O.Some(sortBy) : O.None),
      O.map(sortBy => {
        filters.sortBy = sortBy;
        return sortBy;
      })
    );

    pipe(
      trackQueries.sortOrder.value,
      sortOrder => (sortOrder !== 'desc' ? O.Some(sortOrder) : O.None),
      O.map(sortOrder => {
        filters.sortOrder = sortOrder;
        return sortOrder;
      })
    );

    pipe(
      trackQueries.currentPage.value,
      page => (page > 1 ? O.Some(page) : O.None),
      O.map(page => {
        filters.page = page;
        return page;
      })
    );

    pipe(
      trackQueries.itemsPerPage.value,
      items => (items !== 10 ? O.Some(items) : O.None),
      O.map(items => {
        filters.itemsPerPage = items;
        return items;
      })
    );

    return filters;
  };

  function startFilterSync(): void {
    watch(trackQueries.searchQuery, newSearch => {
      if (isInitializing.value) return;
      searchInput.value = newSearch;
    });

    watch(
      [
        debouncedSearch,
        trackQueries.selectedGenre,
        trackQueries.selectedArtist,
        trackQueries.sortBy,
        trackQueries.sortOrder,
        trackQueries.currentPage,
        trackQueries.itemsPerPage,
      ],
      async () => {
        if (!urlFilters.isInitialized.value || isInitializing.value) return;

        try {
          const filters = buildUrlFilters();
          urlFilters.updateUrl(filters);
          await fetchTracks();
        } catch (error) {
          console.error('Error in unified filter sync:', error);
        }
      }
    );
  }

  async function initializeStore(): Promise<void> {
    isInitializing.value = true;

    const urlData = urlFilters.initializeFromUrl();

    searchInput.value = urlData.search || '';

    trackQueries.setFilters({
      searchQuery: urlData.search || '',
      selectedGenre: urlData.genre || null,
      selectedArtist: urlData.artist || null,
      sortBy: urlData.sortBy || 'createdAt',
      sortOrder: urlData.sortOrder || 'desc',
      page: urlData.page || 1,
      itemsPerPage: urlData.itemsPerPage || 10,
    });

    startFilterSync();

    await fetchTracks();

    isInitializing.value = false;
  }

  // === API ACTIONS ===
  async function fetchTracks(): Promise<void> {
    if (isFetching.value) {
      console.log('fetchTracks: Already loading, skipping...');
      return;
    }

    loading.value = true;
    isFetching.value = true;
    try {
      const params = trackQueries.buildQueryParams();

      if (debouncedSearch.value && debouncedSearch.value.trim() !== '') {
        params.search = debouncedSearch.value.trim();
      } else {
        delete params.search;
      }

      const { data, meta } = await trackApi.getAllTracks(params);
      tracks.value = data;
      totalTracks.value = meta.total;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    } finally {
      loading.value = false;
      isFetching.value = false;
    }
  }

  async function createTrack(trackData: TrackFormData): Promise<Track> {
    loading.value = true;
    try {
      const newTrack = await trackApi.createTrack(trackData);
      await fetchTracks();
      return newTrack;
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function updateTrack(id: string, trackData: Partial<TrackFormData>): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.updateTrack(id, trackData);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTrack(id: string): Promise<void> {
    loading.value = true;
    try {
      await trackApi.deleteTrack(id);
      await fetchTracks();
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTracks(ids: string[]): Promise<void> {
    loading.value = true;
    try {
      await trackApi.deleteTracks(ids);
      trackSelection.clearSelectedTracks();
      await fetchTracks();
    } catch (error) {
      console.error('Error deleting tracks:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function uploadTrackFile(id: string, file: File): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.uploadTrackFile(id, file);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error uploading track file:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTrackFile(id: string): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.deleteTrackFile(id);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error deleting track file:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function resetFilters(): void {
    trackQueries.resetFilters();
    urlFilters.clearUrl();
  }

  return {
    // State
    tracks: tracks as Ref<Track[]>,
    totalTracks: totalTracks,
    loading: loading,

    // Computed
    totalPages,

    // Query composable
    ...trackQueries,

    // Selection composable
    ...trackSelection,

    // Actions
    initializeStore,
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    deleteTracks,
    uploadTrackFile,
    deleteTrackFile,
    resetFilters,

    isInitialized: urlFilters.isInitialized,
  };
});
