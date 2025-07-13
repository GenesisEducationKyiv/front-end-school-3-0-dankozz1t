import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TrackFilters from './TrackFilters.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTrackStore } from '../store/trackStore';
import { useGenresStore } from '@/shared/modules/genres/store/genres';

const meta = {
  title: 'Track/TrackFilters',
  component: TrackFilters,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Track filters component with genre, artist filters, sorting options and items per page. Supports multiple filter combinations and clear functionality.',
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
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
} satisfies Meta<typeof TrackFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTracks = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genres: ['Rock', 'Progressive Rock'],
    slug: 'bohemian-rhapsody',
    coverImage: 'https://via.placeholder.com/300x300?text=Queen',
    audioFile: 'sample-audio.mp3',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    genres: ['Rock', 'Classic Rock'],
    slug: 'hotel-california',
    coverImage: 'https://via.placeholder.com/300x300?text=Eagles',
    audioFile: 'hotel-california.mp3',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    genres: ['Pop', 'Rock'],
    slug: 'imagine',
    coverImage: 'https://via.placeholder.com/300x300?text=Imagine',
    audioFile: 'imagine.mp3',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    genres: ['Rock', 'Hard Rock'],
    slug: 'stairway-to-heaven',
    coverImage: 'https://via.placeholder.com/300x300?text=Zeppelin',
    audioFile: 'stairway.mp3',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    title: 'Thriller',
    artist: 'Michael Jackson',
    album: 'Thriller',
    genres: ['Pop', 'Funk'],
    slug: 'thriller',
    coverImage: 'https://via.placeholder.com/300x300?text=MJ',
    audioFile: 'thriller.mp3',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

const mockGenres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Classical', 'Progressive Rock', 'Classic Rock', 'Funk', 'Hard Rock', 'Blues', 'Country', 'Hip Hop'];

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default filters state with no active filters. Shows all filter controls ready for use.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const WithGenreFilter: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with active genre filter. Shows genre chip and clear all button.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: 'Rock',
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const WithArtistFilter: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with active artist filter. Shows artist chip and clear all button.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: 'Queen',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const WithSearchQuery: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with active search query. Shows search chip and clear all button.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: 'bohemian',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const MultipleFilters: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with multiple active filters. Shows all filter chips and clear all button.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: 'rock',
          selectedGenre: 'Rock',
          selectedArtist: 'Queen',
          sortBy: 'title',
          sortOrder: 'asc',
          itemsPerPage: 20,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const DifferentSorting: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with different sorting options selected. Shows various sort configurations.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'artist',
          sortOrder: 'desc',
          itemsPerPage: 50,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const LargePageSize: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with large page size selected. Shows 100 items per page configuration.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 100,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};



export const EmptyGenres: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Filters with empty genres list. Shows state when no genres are available.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: [],
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
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
        story: 'Filters on mobile device. Shows responsive design and behavior on small screens.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: 'mobile',
          selectedGenre: 'Rock',
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
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
        story: 'Filters on tablet device. Shows responsive design for medium screens.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: 'Pop',
          selectedArtist: 'Michael Jackson',
          sortBy: 'title',
          sortOrder: 'asc',
          itemsPerPage: 20,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
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
        story: 'Compact version of filters for use in limited space.',
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
        const genresStore = useGenresStore();
        
        trackStore.$patch({
          tracks: mockTracks,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          itemsPerPage: 10,
        });
        
        genresStore.$patch({
          genres: mockGenres,
        });
        
        return { pinia };
      },
      template: '<div style="max-width: 600px;"><story :pinia="pinia" /></div>',
    }),
  ],
};