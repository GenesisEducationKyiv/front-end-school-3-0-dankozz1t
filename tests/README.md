# Vue 3 Music Management SPA - Test Suite

This document outlines the comprehensive testing setup for the Vue 3 Music Management SPA using Vitest and @vue/test-utils.

## Test Organization Structure

### Global Test Directory (`tests/`)
- **`tests/setup.ts`** - Global test configuration and setup
- **`tests/types.ts`** - Type definitions for test utilities
- **`tests/utils/test-utils.ts`** - Shared test utilities and mock factories
- **`tests/components/`** - Legacy component tests (being migrated)

### Domain Module Tests (`src/modules/{feature}/tests/`)
Each domain module contains its own test directory with the following structure:

```
src/modules/track/tests/
├── api/
│   └── trackApi.spec.ts          # API layer tests
├── components/
│   ├── TrackListItem.spec.ts     # Component tests
│   ├── TrackList.spec.ts         # Component tests
│   └── TrackFilters.spec.ts      # Component tests
├── composables/
│   ├── useTrackSelection.spec.ts # Composable tests
│   └── useTrackQueries.spec.ts   # Composable tests
└── store/
    └── trackStore.spec.ts        # Store tests

src/modules/player/tests/
├── components/
│   └── GlobalAudioPlayer.spec.ts # Component tests
├── composables/
│   └── useAudioPlayer.spec.ts    # Composable tests
└── store/
    └── playerStore.spec.ts       # Store tests
```

## Test Types and Patterns

### 1. API Layer Tests (`api/*.spec.ts`)

Tests for pure API functions using mocked HTTP client:

```typescript
// Example: src/modules/track/tests/api/trackApi.spec.ts
import { trackApi } from '../../api/trackApi';

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Track API', () => {
  it('should fetch tracks successfully', async () => {
    // Test implementation
  });
});
```

**Coverage:**
- All CRUD operations
- Query parameter handling
- Error scenarios
- File upload functionality

### 2. Composable Tests (`composables/*.spec.ts`)

Tests for Vue composables focusing on logic and reactivity:

```typescript
// Example: src/modules/track/tests/composables/useTrackSelection.spec.ts
import { useTrackSelection } from '../../composables/useTrackSelection';

describe('useTrackSelection', () => {
  it('should manage track selection state', () => {
    const selection = useTrackSelection();
    // Test reactive behavior
  });
});
```

**Coverage:**
- State management
- Computed properties
- Method functionality
- Reactive behavior
- Edge cases

### 3. Store Tests (`store/*.spec.ts`)

Tests for Pinia stores with mocked dependencies:

```typescript
// Example: src/modules/track/tests/store/trackStore.spec.ts
import { useTrackStore } from '../../store/trackStore';

vi.mock('../../api/trackApi');

describe('Track Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('should manage track state', async () => {
    const store = useTrackStore();
    // Test store actions and state
  });
});
```

**Coverage:**
- Store actions
- State mutations
- Computed getters
- Error handling
- Side effects

### 4. Component Tests (`components/*.spec.ts`)

Tests for Vue components with shallow rendering and mocked dependencies:

```typescript
// Example: src/modules/track/tests/components/TrackListItem.spec.ts
import { mount } from '@vue/test-utils';
import TrackListItem from '../../components/TrackListItem.vue';

vi.mock('../../store/trackStore');

describe('TrackListItem', () => {
  const mountComponent = (props = {}) => {
    return mount(TrackListItem, {
      props: { track: mockTrack, ...props },
      global: {
        plugins: [pinia],
        stubs: {
          'v-list-item': { template: '<div><slot /></div>' },
          // Minimal Vuetify component stubs
        },
      },
    });
  };
  
  it('should render track information', () => {
    // Test component rendering and behavior
  });
});
```

**Coverage:**
- Template rendering
- Props handling
- Event emissions
- User interactions
- Conditional rendering
- Accessibility

## Test Utilities and Mocks

### Shared Test Utilities (`tests/utils/test-utils.ts`)

Provides factory functions for creating mock data:

```typescript
// Mock track factory
export const createMockTrack = (overrides = {}): Track => ({
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  // ... other properties
  ...overrides,
});

// Vuetify wrapper factory
export const createVuetifyWrapper = (component, options = {}) => {
  return mount(component, {
    global: {
      plugins: [vuetify, pinia],
      ...options.global,
    },
    ...options,
  });
};
```

### Mock Strategies

1. **API Mocking:** Mock the HTTP service layer
2. **Store Mocking:** Mock store composables with vi.mock()
3. **Component Mocking:** Stub Vuetify components when needed
4. **Browser APIs:** Mock HTMLAudioElement for audio player tests

## Running Tests

### All Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Module Tests
```bash
# Track module tests
npm run test src/modules/track/tests

# Player module tests  
npm run test src/modules/player/tests

# Specific test file
npm run test src/modules/track/tests/store/trackStore.spec.ts
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)
- Global setup for Vue and Vuetify
- Path aliases (`@/` for `src/`)
- Environment configuration (jsdom)
- Coverage settings

### Global Setup (`tests/setup.ts`)
- Vue Test Utils configuration
- Vuetify plugin setup
- Global mocks and polyfills

## Best Practices

### 1. Test Organization
- Group related tests with `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking Strategy
- Mock at the boundary (API layer, not internal functions)
- Use minimal Vuetify component stubs
- Mock browser APIs when needed

### 3. Assertions
- Test behavior, not implementation details
- Use semantic assertions (toContain, toBeTruthy, etc.)
- Test error scenarios

### 4. Component Testing
- Focus on user interactions
- Test accessibility features
- Verify event emissions
- Test conditional rendering

### 5. Store Testing
- Test actions and their side effects
- Verify state mutations
- Test computed properties
- Mock external dependencies

## Coverage Goals

- **API Layer:** 100% - All endpoints and error scenarios
- **Stores:** 90%+ - All actions, getters, and state mutations
- **Composables:** 90%+ - All methods and reactive behavior
- **Components:** 80%+ - Core functionality and user interactions

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release preparation

Coverage reports are generated and tracked to ensure code quality standards.
