import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TrackSearch from './TrackSearch.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTrackStore } from '../store/trackStore';

const meta = {
  title: 'Track/TrackSearch',
  component: TrackSearch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Track search component with debounce support and clear functionality. Connects to Pinia store for search state management.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
} satisfies Meta<typeof TrackSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default search input state with placeholder text. Field is ready for search query input.',
      },
    },
  },
};

export const WithInitialValue: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Search input with pre-filled search query. Shows how component displays existing search query.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'queen bohemian' });
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const LongSearchQuery: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Search input with very long query to test text handling and possible truncation.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'This is a very long search query that should test how the input handles long text' });
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const SpecialCharacters: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Search input with special characters and quotes. Tests handling of non-standard characters.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'rock & roll "classic" (1980s)' });
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const NumbersAndSymbols: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Search input with numbers and symbols. Shows search handling with numeric values.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'album 1984 #1 hit single' });
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const EmptyAfterClear: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Search input after clearing. Shows state when user cleared the field using clear button.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: '' });
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Search input on mobile device. Shows responsive design and behavior on small screens.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'mobile search' });
        return { pinia };
      },
      template: '<div style="max-width: 375px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Search input on tablet device. Shows responsive design for medium screens.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'tablet search' });
        return { pinia };
      },
      template: '<div style="max-width: 768px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const Compact: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Compact version of search input for use in limited space.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'compact' });
        return { pinia };
      },
      template: '<div style="max-width: 300px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const Wide: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Wide version of search input for use in large spaces.',
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const pinia = createPinia();
        setActivePinia(pinia);
        const trackStore = useTrackStore();
        trackStore.$patch({ searchQuery: 'wide search field' });
        return { pinia };
      },
      template: '<div style="max-width: 800px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

 