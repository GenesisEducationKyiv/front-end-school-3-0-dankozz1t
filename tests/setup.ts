import { config } from '@vue/test-utils';
import { vi } from 'vitest';

config.global.mocks = {
  $vuetify: {
    theme: {
      dark: false,
    },
  },
};

config.global.stubs = {};

config.global.provide = {
  form: {
    register: () => {},
    unregister: () => {},
    update: () => {},
    validate: () => ({ valid: true }),
  },
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

HTMLMediaElement.prototype.play = vi.fn();
HTMLMediaElement.prototype.pause = vi.fn();
HTMLMediaElement.prototype.load = vi.fn();
