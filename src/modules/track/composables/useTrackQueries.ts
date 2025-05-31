import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type {
  QueryParams,
  TrackFilters,
  TrackSorting,
  TrackPagination,
  TrackSortField,
  TrackSortOrder,
} from '../types';

// Return type interface for the composable
export interface UseTrackQueriesReturn {
  // State
  searchQuery: Ref<string>;
  selectedGenre: Ref<string | null>;
  selectedArtist: Ref<string | null>;
  sortBy: Ref<string>;
  sortOrder: Ref<TrackSortOrder>;
  currentPage: Ref<number>;
  itemsPerPage: Ref<number>;

  // Computed
  filters: ComputedRef<TrackFilters>;
  sorting: ComputedRef<TrackSorting>;

  // Methods
  buildQueryParams: () => QueryParams;
  resetFilters: () => void;
  updateSearchQuery: (query: string) => void;
  updateGenreFilter: (genre: string | null) => void;
  updateArtistFilter: (artist: string | null) => void;
  updateSorting: (field: string, order: TrackSortOrder) => void;
  updatePage: (page: number) => void;
  updateItemsPerPage: (items: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

/**
 * Composable for managing track query parameters, filters, sorting, and pagination
 */
export function useTrackQueries(): UseTrackQueriesReturn {
  // === STATE ===
  const searchQuery = ref<string>('');
  const selectedGenre = ref<string | null>(null);
  const selectedArtist = ref<string | null>(null);
  const sortBy = ref<string>('createdAt');
  const sortOrder = ref<TrackSortOrder>('desc');
  const currentPage = ref<number>(1);
  const itemsPerPage = ref<number>(10);

  // === COMPUTED ===
  const filters: ComputedRef<TrackFilters> = computed(() => ({
    searchQuery: searchQuery.value,
    selectedGenre: selectedGenre.value,
    selectedArtist: selectedArtist.value,
  }));

  const sorting: ComputedRef<TrackSorting> = computed(() => ({
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  }));

  // === METHODS ===
  /**
   * Build query parameters for API requests
   */
  function buildQueryParams(): QueryParams {
    const params: QueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort: sortBy.value as TrackSortField,
      order: sortOrder.value,
    };

    if (searchQuery.value && searchQuery.value.trim() !== '') {
      params.search = searchQuery.value.trim();
    }

    if (selectedGenre.value) {
      params.genre = selectedGenre.value;
    }

    if (selectedArtist.value) {
      params.artist = selectedArtist.value;
    }

    return params;
  }

  /**
   * Reset all filters and sorting to defaults
   */
  function resetFilters(): void {
    searchQuery.value = '';
    selectedGenre.value = null;
    selectedArtist.value = null;
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
    currentPage.value = 1;
  }

  /**
   * Update search query
   */
  function updateSearchQuery(query: string): void {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page on search
  }

  /**
   * Update genre filter
   */
  function updateGenreFilter(genre: string | null): void {
    selectedGenre.value = genre;
    currentPage.value = 1; // Reset to first page on filter change
  }

  /**
   * Update artist filter
   */
  function updateArtistFilter(artist: string | null): void {
    selectedArtist.value = artist;
    currentPage.value = 1; // Reset to first page on filter change
  }

  /**
   * Update sorting
   */
  function updateSorting(field: string, order: TrackSortOrder): void {
    sortBy.value = field;
    sortOrder.value = order;
    currentPage.value = 1; // Reset to first page on sort change
  }

  /**
   * Update pagination - go to specific page
   */
  function updatePage(page: number): void {
    if (page >= 1) {
      currentPage.value = page;
    }
  }

  /**
   * Go to specific page (alias for updatePage)
   */
  function goToPage(page: number): void {
    updatePage(page);
  }

  /**
   * Go to next page
   */
  function nextPage(): void {
    currentPage.value += 1;
  }

  /**
   * Go to previous page
   */
  function previousPage(): void {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  }

  /**
   * Update items per page
   */
  function updateItemsPerPage(items: number): void {
    if (items > 0) {
      itemsPerPage.value = items;
      currentPage.value = 1; // Reset to first page on items per page change
    }
  }

  return {
    // State
    searchQuery,
    selectedGenre,
    selectedArtist,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,

    // Computed
    filters,
    sorting,

    // Methods
    buildQueryParams,
    resetFilters,
    updateSearchQuery,
    updateGenreFilter,
    updateArtistFilter,
    updateSorting,
    updatePage,
    updateItemsPerPage,
    goToPage,
    nextPage,
    previousPage,
  };
}
