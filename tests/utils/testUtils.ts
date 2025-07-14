import { vi } from 'vitest';
import type { Track, TrackFormData } from '../../src/modules/track/types';

// ===== MOCK FACTORIES =====

export const createMockTrack = (overrides: Partial<Track> = {}): Track => ({
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

export const createMockTrackFormData = (overrides: Partial<TrackFormData> = {}): TrackFormData => ({
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock'],
  coverImage: 'https://example.com/cover.jpg',
  ...overrides,
});

export const createMockTracks = (count: number, baseOverrides: Partial<Track> = {}): Track[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockTrack({
      id: `track-${index + 1}`,
      title: `Test Track ${index + 1}`,
      ...baseOverrides,
    })
  );
};

// ===== VUETIFY STUBS =====
export const vuetifyStubs = {
  'v-app': { template: '<div class="v-app"><slot /></div>' },
  'v-app-bar': { template: '<div class="v-app-bar"><slot /></div>' },
  'v-main': { template: '<div class="v-main"><slot /></div>' },
  'v-footer': { template: '<div class="v-footer"><slot /></div>' },
  'v-container': { template: '<div class="v-container"><slot /></div>' },
  'v-card': { template: '<div class="v-card"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },
  'v-card-actions': { template: '<div class="v-card-actions"><slot /></div>' },
  'v-row': { template: '<div class="v-row"><slot /></div>' },
  'v-col': { template: '<div class="v-col"><slot /></div>' },
  'v-btn': {
    template:
      '<button class="v-btn" :data-testid="$attrs[\'data-testid\']" @click="$emit(\'click\')"><slot /></button>',
    inheritAttrs: false,
  },
  'v-text-field': {
    template:
      '<input class="v-text-field" :data-testid="$attrs[\'data-testid\']" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    inheritAttrs: false,
  },
  'v-select': {
    template:
      '<select class="v-select" :data-testid="$attrs[\'data-testid\']" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="item in items" :key="item" :value="item">{{ item }}</option></select>',
    props: ['modelValue', 'items'],
    inheritAttrs: false,
  },
  'v-combobox': {
    template:
      '<input class="v-combobox" :data-testid="$attrs[\'data-testid\']" :value="Array.isArray(modelValue) ? modelValue.join(\', \') : modelValue" @input="handleInput" />',
    props: ['modelValue', 'items', 'multiple'],
    methods: {
      handleInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (this.multiple) {
          this.$emit('update:modelValue', value.split(', ').filter(Boolean));
        } else {
          this.$emit('update:modelValue', value);
        }
      },
    },
    inheritAttrs: false,
  },
  'v-checkbox': {
    template:
      '<input type="checkbox" class="v-checkbox" :data-testid="$attrs[\'data-testid\']" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
    props: ['modelValue'],
    inheritAttrs: false,
  },
  'v-chip': { template: '<span class="v-chip"><slot /></span>' },
  'v-icon': { template: '<i class="v-icon"><slot /></i>' },
  'v-img': { template: '<div class="v-img"></div>' },
  'v-spacer': { template: '<div class="v-spacer"></div>' },
  'v-toolbar': { template: '<div class="v-toolbar"><slot /></div>' },
  'v-toolbar-title': { template: '<div class="v-toolbar-title"><slot /></div>' },
  'v-pagination': { template: '<div class="v-pagination"></div>' },
  'v-progress-circular': { template: '<div class="v-progress-circular"></div>' },
  'v-progress-linear': { template: '<div class="v-progress-linear"></div>' },
  'v-slider': {
    template:
      '<input type="range" class="v-slider" :data-testid="$attrs[\'data-testid\']" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />',
    props: ['modelValue'],
    inheritAttrs: false,
  },
  'v-file-input': {
    template:
      '<input type="file" class="v-file-input" :data-testid="$attrs[\'data-testid\']" @change="$emit(\'update:modelValue\', $event.target.files[0])" />',
    props: ['modelValue'],
    inheritAttrs: false,
  },
  'v-dialog': {
    template: '<div class="v-dialog" v-if="modelValue"><slot /></div>',
    props: ['modelValue'],
  },
  'v-form': {
    template: '<form class="v-form" @submit.prevent><slot /></form>',
    methods: {
      validate: () => Promise.resolve({ valid: true }),
    },
  },
  'v-snackbar': {
    template: '<div class="v-snackbar" v-if="modelValue"><slot /><slot name="actions" /></div>',
    props: ['modelValue'],
  },
};

// ===== MOCK STORE HELPERS =====
export const createMockTrackStore = (overrides: any = {}) => ({
  tracks: [],
  totalTracks: 0,
  loading: false,
  currentPage: 1,
  itemsPerPage: 20,
  totalPages: 0,
  selectedTracks: [],
  selectedCount: 0,
  isInBulkMode: false,
  searchQuery: '',
  selectedGenre: null,
  selectedArtist: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  fetchTracks: vi.fn(),
  createTrack: vi.fn(),
  updateTrack: vi.fn(),
  deleteTrack: vi.fn(),
  deleteTracks: vi.fn(),
  uploadTrackFile: vi.fn(),
  deleteTrackFile: vi.fn(),
  toggleTrackSelection: vi.fn(),
  isTrackSelected: vi.fn(),
  selectAllTracks: vi.fn(),
  clearSelectedTracks: vi.fn(),
  toggleSelectAll: vi.fn(),
  updateSearchQuery: vi.fn(),
  updateGenreFilter: vi.fn(),
  updateArtistFilter: vi.fn(),
  updateSorting: vi.fn(),
  updateItemsPerPage: vi.fn(),
  goToPage: vi.fn(),
  resetFilters: vi.fn(),
  ...overrides,
});

export const createMockPlayerStore = (overrides: any = {}) => ({
  currentTrack: null,
  currentAudio: null,
  currentTime: 0,
  duration: 0,
  volume: 100,
  loading: false,
  isPlaying: false,
  isPaused: false,
  hasAudioLoaded: false,
  playTrack: vi.fn(),
  resumeTrack: vi.fn(),
  pauseTrack: vi.fn(),
  stopTrack: vi.fn(),
  togglePlayPause: vi.fn(),
  seekTo: vi.fn(),
  setVolume: vi.fn(),
  isTrackPlaying: vi.fn().mockReturnValue(false),
  isTrackPaused: vi.fn().mockReturnValue(false),
  isTrackLoaded: vi.fn().mockReturnValue(false),
  ...overrides,
});

export const createMockModalsPool = (overrides: any = {}) => ({
  modalsPool: [],
  isItemInPool: vi.fn().mockReturnValue(false),
  addVisibleItem: vi.fn(),
  removeVisibleItem: vi.fn(),
  ...overrides,
});
