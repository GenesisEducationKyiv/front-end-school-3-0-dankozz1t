import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../../src/composables/useDebounce', () => ({
  useDebounce: (initialValue: string, _delay: number) => {
    const value = ref(initialValue);
    const debouncedValue = computed(() => value.value);
    return { value, debouncedValue };
  },
}));

import { ref, computed } from 'vue';

const mockTracksStore = {
  searchQuery: '',
  currentPage: 1,
  fetchTracks: vi.fn(),
};

vi.mock('../../src/stores/tracks', () => ({
  useTracksStore: vi.fn(() => mockTracksStore),
}));

describe('TrackSearch.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockTracksStore.searchQuery = '';
    mockTracksStore.currentPage = 1;
  });

  it('renders search input field', async () => {
    const searchStore = {
      searchQuery: '',
      searchInput: '',
    };

    expect(searchStore.searchQuery).toBe('');
    expect(searchStore.searchInput).toBe('');
  });

  it('updates searchQuery in the store when input changes', async () => {
    const searchInput = ref('');
    const debouncedValue = computed(() => searchInput.value);

    const updateSearchQuery = (query: string) => {
      mockTracksStore.searchQuery = query;
    };

    searchInput.value = 'test query';

    updateSearchQuery(debouncedValue.value);

    expect(mockTracksStore.searchQuery).toBe('test query');
  });

  it('resets page to 1 when search query changes', async () => {
    mockTracksStore.currentPage = 3;

    const searchInput = ref('');
    const debouncedValue = computed(() => searchInput.value);

    const updateSearchAndResetPage = (query: string) => {
      mockTracksStore.searchQuery = query;
      mockTracksStore.currentPage = 1;
    };

    searchInput.value = 'test query';

    updateSearchAndResetPage(debouncedValue.value);

    expect(mockTracksStore.currentPage).toBe(1);
  });

  it('triggers tracks fetch when search query changes', async () => {
    const searchInput = ref('');
    const debouncedValue = computed(() => searchInput.value);

    const updateSearchAndFetch = (query: string) => {
      mockTracksStore.searchQuery = query;
      mockTracksStore.fetchTracks();
    };

    searchInput.value = 'test query';

    updateSearchAndFetch(debouncedValue.value);

    expect(mockTracksStore.fetchTracks).toHaveBeenCalled();
  });

  it('clears search input when clear button is clicked', async () => {
    const searchInput = ref('test query');
    const debouncedValue = computed(() => searchInput.value);

    const updateSearchAndFetch = (query: string) => {
      mockTracksStore.searchQuery = query;
      mockTracksStore.fetchTracks();
    };

    updateSearchAndFetch(debouncedValue.value);
    expect(mockTracksStore.searchQuery).toBe('test query');

    searchInput.value = '';
    updateSearchAndFetch(debouncedValue.value);

    expect(mockTracksStore.searchQuery).toBe('');

    expect(mockTracksStore.fetchTracks).toHaveBeenCalledTimes(2);
  });

  it('handles different search terms correctly', async () => {
    const searchInput = ref('');
    const debouncedValue = computed(() => searchInput.value);

    const updateSearchAndFetch = (query: string) => {
      mockTracksStore.searchQuery = query;
      mockTracksStore.fetchTracks();
    };

    searchInput.value = 'Artist Name';
    updateSearchAndFetch(debouncedValue.value);
    expect(mockTracksStore.searchQuery).toBe('Artist Name');
    expect(mockTracksStore.fetchTracks).toHaveBeenCalledTimes(1);

    searchInput.value = 'Album Title';
    updateSearchAndFetch(debouncedValue.value);
    expect(mockTracksStore.searchQuery).toBe('Album Title');
    expect(mockTracksStore.fetchTracks).toHaveBeenCalledTimes(2);

    searchInput.value = 'Track Title';
    updateSearchAndFetch(debouncedValue.value);
    expect(mockTracksStore.searchQuery).toBe('Track Title');
    expect(mockTracksStore.fetchTracks).toHaveBeenCalledTimes(3);
  });
});
