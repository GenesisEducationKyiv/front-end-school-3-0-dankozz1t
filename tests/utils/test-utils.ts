import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';
import type { Track, TrackFormData } from '../../src/modules/track/types';
import type { Component } from 'vue';

// Mock track factory
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

// Mock track form data factory
export const createMockTrackFormData = (overrides: Partial<TrackFormData> = {}): TrackFormData => ({
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock'],
  coverImage: 'https://example.com/cover.jpg',
  ...overrides,
});

// Mock API response factory
export const createMockApiResponse = <T>(data: T, overrides: any = {}) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  ...overrides,
});

// Mock pagination metadata
export const createMockPaginationMeta = (overrides: any = {}) => ({
  currentPage: 1,
  totalPages: 1,
  totalItems: 1,
  itemsPerPage: 20,
  hasNextPage: false,
  hasPreviousPage: false,
  ...overrides,
});

// Setup function for tests with Pinia
export const setupTestPinia = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
};

// Mock store factory
export const createMockStore = <T extends Record<string, any>>(
  storeName: string,
  initialState: T,
  actions: Record<string, any> = {}
) => {
  const store = {
    ...initialState,
    ...actions,
    $id: storeName,
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
  };
  return store;
};

// Component mounting helper with common options
export const mountComponent = (component: Component, options: any = {}): VueWrapper<any> => {
  const pinia = setupTestPinia();

  return mount(component, {
    global: {
      plugins: [pinia],
      mocks: {
        $vuetify: {
          theme: { dark: false },
          display: { mobile: false },
        },
      },
      stubs: ['v-dialog', 'v-card', 'v-btn'],
      ...options.global,
    },
    ...options,
  });
};

// Shallow mounting helper
export const shallowMountComponent = (component: Component, options: any = {}): VueWrapper<any> => {
  const pinia = setupTestPinia();

  return shallowMount(component, {
    global: {
      plugins: [pinia],
      mocks: {
        $vuetify: {
          theme: { dark: false },
          display: { mobile: false },
        },
      },
      ...options.global,
    },
    ...options,
  });
};

// Mock API client
export const createMockApiClient = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
});

// Mock file helper
export const createMockFile = (
  name = 'test.mp3',
  size = 1024 * 1024,
  type = 'audio/mpeg'
): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Wait for async operations
export const waitForAsync = (timeout = 0) => new Promise(resolve => setTimeout(resolve, timeout));

// Mock router
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: { value: { path: '/', params: {}, query: {} } },
});

// Mock notifications
export const createMockNotifications = () => ({
  notify: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
});
