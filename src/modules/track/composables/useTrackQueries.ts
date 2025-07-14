import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { O, pipe } from '@mobily/ts-belt';
import type {
  QueryParams,
  TrackFilters,
  TrackSorting,
  TrackSortField,
  TrackSortOrder,
} from '../types';

export interface UseTrackQueriesReturn {
  // State
  searchQuery: Ref<string>;
  selectedGenre: Ref<string | null>;
  selectedArtist: Ref<string | null>;
  sortBy: Ref<TrackSortField>;
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
  updateSorting: (field: TrackSortField, order: TrackSortOrder) => void;
  updatePage: (page: number) => void;
  updateItemsPerPage: (items: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setFilters: (
    filters: Partial<
      TrackFilters & {
        sortBy: TrackSortField;
        sortOrder: TrackSortOrder;
        page: number;
        itemsPerPage: number;
      }
    >
  ) => void;
}

export function useTrackQueries(): UseTrackQueriesReturn {
  // === STATE ===
  const searchQuery = ref<string>('');
  const selectedGenre = ref<string | null>(null);
  const selectedArtist = ref<string | null>(null);
  const sortBy = ref<TrackSortField>('createdAt');
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
  function buildQueryParams(): QueryParams {
    const params: QueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort: sortBy.value,
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

  function resetFilters(): void {
    searchQuery.value = '';
    selectedGenre.value = null;
    selectedArtist.value = null;
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
    currentPage.value = 1;
    itemsPerPage.value = 10;
  }

  function updateSearchQuery(query: string): void {
    searchQuery.value = query;
    currentPage.value = 1;
  }

  function updateGenreFilter(genre: string | null): void {
    selectedGenre.value = genre;
    currentPage.value = 1;
  }

  function updateArtistFilter(artist: string | null): void {
    selectedArtist.value = artist;
    currentPage.value = 1;
  }

  function updateSorting(field: TrackSortField, order: TrackSortOrder): void {
    sortBy.value = field;
    sortOrder.value = order;
    currentPage.value = 1;
  }

  function updatePage(page: number): void {
    if (page >= 1) {
      currentPage.value = page;
    }
  }

  function goToPage(page: number): void {
    updatePage(page);
  }

  function nextPage(): void {
    currentPage.value += 1;
  }

  function previousPage(): void {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  }

  function updateItemsPerPage(items: number): void {
    if (items > 0) {
      itemsPerPage.value = items;
      currentPage.value = 1;
    }
  }

  function setFilters(
    filters: Partial<
      TrackFilters & {
        sortBy: TrackSortField;
        sortOrder: TrackSortOrder;
        page: number;
        itemsPerPage: number;
      }
    >
  ): void {
    pipe(filters, f => {
      pipe(
        f.searchQuery,
        O.fromNullable,
        O.map(value => (searchQuery.value = value))
      );
      pipe(
        f.selectedGenre,
        O.fromNullable,
        O.map(value => (selectedGenre.value = value))
      );
      pipe(
        f.selectedArtist,
        O.fromNullable,
        O.map(value => (selectedArtist.value = value))
      );
      pipe(
        f.sortBy,
        O.fromNullable,
        O.map(value => (sortBy.value = value))
      );
      pipe(
        f.sortOrder,
        O.fromNullable,
        O.map(value => (sortOrder.value = value))
      );
      pipe(
        f.page,
        O.fromNullable,
        O.map(value => (currentPage.value = value))
      );
      pipe(
        f.itemsPerPage,
        O.fromNullable,
        O.map(value => (itemsPerPage.value = value))
      );
      return f;
    });
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
    setFilters,
  };
}
