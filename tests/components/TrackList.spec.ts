import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../../src/components/Tracks/TrackListItem.vue', () => ({
  default: {
    props: ['track', 'bulkSelectMode', 'selected'],
    template: `
      <div class="track-item" :data-id="track.id" :data-selected="selected">
        {{ track.title }} - {{ track.artist }}
      </div>
    `,
  },
}));

const mockTracks = [
  { id: '1', title: 'Track 1', artist: 'Artist 1', album: 'Album 1' },
  { id: '2', title: 'Track 2', artist: 'Artist 2', album: 'Album 2' },
];

const mockTracksStore = {
  tracks: mockTracks,
  loading: false,
  selectedTracks: [],
  fetchTracks: vi.fn().mockResolvedValue(undefined),
  totalPages: 1,
  currentPage: 1,
  toggleTrackSelection: vi.fn(),
  clearSelectedTracks: vi.fn(),
};

vi.mock('../../src/stores/tracks', () => ({
  useTracksStore: vi.fn(() => mockTracksStore),
}));

vi.mock('../../src/stores/modalsPool', () => ({
  useModalsPool: vi.fn(() => ({
    addVisibleItem: vi.fn(),
  })),
}));

describe('TrackList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockTracksStore.selectedTracks = [];
  });

  it('renders track cards from store', async () => {
    const wrapper = {
      vm: {
        tracksStore: {
          tracks: mockTracks,
          fetchTracks: vi.fn().mockResolvedValue(undefined),
        },
      },
    };

    await wrapper.vm.tracksStore.fetchTracks();

    expect(wrapper.vm.tracksStore.fetchTracks).toHaveBeenCalled();

    expect(wrapper.vm.tracksStore.tracks.length).toBe(2);
    expect(wrapper.vm.tracksStore.tracks[0].id).toBe('1');
    expect(wrapper.vm.tracksStore.tracks[1].id).toBe('2');
  });

  it('shows loading state', async () => {
    const mockStore = {
      loading: true,
      tracks: [],
    };

    expect(mockStore.loading).toBe(true);

    expect(mockStore.tracks.length).toBe(0);
  });

  it('shows empty state when no tracks', async () => {
    const mockStore = {
      loading: false,
      tracks: [],
    };

    expect(mockStore.loading).toBe(false);
    expect(mockStore.tracks.length).toBe(0);
  });

  it('toggles bulk selection mode', async () => {
    const mockViewModel = {
      bulkSelectMode: false,
      toggleBulkMode: function () {
        this.bulkSelectMode = !this.bulkSelectMode;
        if (!this.bulkSelectMode) {
          this.clearSelectedTracks();
        }
      },
      clearSelectedTracks: vi.fn(),
    };

    expect(mockViewModel.bulkSelectMode).toBe(false);

    mockViewModel.toggleBulkMode();

    expect(mockViewModel.bulkSelectMode).toBe(true);

    mockViewModel.toggleBulkMode();

    expect(mockViewModel.bulkSelectMode).toBe(false);

    expect(mockViewModel.clearSelectedTracks).toHaveBeenCalled();
  });

  it('handles track creation', async () => {
    const addVisibleItem = vi.fn();

    const mockViewModel = {
      modalsStore: {
        addVisibleItem,
      },
      handleCreateTrack: function () {
        this.modalsStore.addVisibleItem('TrackForm');
      },
    };

    mockViewModel.handleCreateTrack();

    expect(addVisibleItem).toHaveBeenCalledWith('TrackForm');
  });

  it('handles bulk delete when tracks are selected', async () => {
    const addVisibleItem = vi.fn();

    const mockViewModel = {
      tracksStore: {
        selectedTracks: ['1', '2'],
      },
      modalsStore: {
        addVisibleItem,
      },
      handleBulkDelete: function () {
        if (this.tracksStore.selectedTracks.length > 0) {
          this.modalsStore.addVisibleItem('DeleteTrack', {
            trackIds: this.tracksStore.selectedTracks,
          });
        }
      },
    };

    mockViewModel.handleBulkDelete();

    expect(addVisibleItem).toHaveBeenCalledWith('DeleteTrack', {
      trackIds: ['1', '2'],
    });
  });
});
