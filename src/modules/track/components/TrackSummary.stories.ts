import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TrackSummary from './TrackSummary.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTrackStore } from '../store/trackStore';

const meta = {
  title: 'Track/TrackSummary',
  component: TrackSummary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Track summary statistics component. Shows total tracks, unique artists, albums and top genres. Supports filtered results display and pagination.',
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
} satisfies Meta<typeof TrackSummary>;

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

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default state with 5 tracks on current page. Shows statistics for current page with pagination.',
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
        trackStore.$patch({
          tracks: mockTracks,
          totalTracks: 25,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const WithManyTracks: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary with many tracks loaded. Shows pagination info and statistics for large collections.',
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
        trackStore.$patch({
          tracks: mockTracks,
          totalTracks: 150,
          currentPage: 3,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const WithFilters: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary with active filters. Shows statistics for filtered results and active filters indication.',
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
        trackStore.$patch({
          tracks: mockTracks.filter(track => track.genres.includes('Rock')),
          totalTracks: 15,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: 'rock',
          selectedGenre: 'Rock',
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary when no tracks are available. Shows empty state with zero values.',
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
        trackStore.$patch({
          tracks: [],
          totalTracks: 0,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const SearchResults: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary showing search results with specific query. Shows statistics for specific search query.',
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
        trackStore.$patch({
          tracks: mockTracks.filter(track => 
            track.title.toLowerCase().includes('queen') || 
            track.artist.toLowerCase().includes('queen')
          ),
          totalTracks: 2,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: 'queen',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const ArtistFilter: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary when filtered by specific artist. Shows statistics for single artist.',
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
        trackStore.$patch({
          tracks: mockTracks.filter(track => track.artist === 'Queen'),
          totalTracks: 1,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: 'Queen',
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
        story: 'Summary with large page size. Shows statistics when many tracks are displayed on page.',
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
        const manyTracks = [
          ...mockTracks,
          ...mockTracks.map((track, index) => ({
            ...track,
            id: `${track.id}-copy-${index}`,
            title: `${track.title} (Copy ${index + 1})`,
            slug: `${track.slug}-copy-${index}`,
          }))
        ];
        trackStore.$patch({
          tracks: manyTracks,
          totalTracks: 50,
          currentPage: 1,
          itemsPerPage: 50,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 1200px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

export const LastPage: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Summary on last page of pagination. Shows statistics when user is at the end of list.',
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
        trackStore.$patch({
          tracks: mockTracks.slice(0, 3), // Only 3 tracks on last page
          totalTracks: 23,
          currentPage: 3,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
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
        story: 'Summary on mobile device. Shows responsive design and behavior on small screens.',
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
        trackStore.$patch({
          tracks: mockTracks,
          totalTracks: 25,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
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
        story: 'Summary on tablet device. Shows responsive design for medium screens.',
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
        trackStore.$patch({
          tracks: mockTracks,
          totalTracks: 25,
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: '',
          selectedGenre: null,
          selectedArtist: null,
        });
        return { pinia };
      },
      template: '<div style="max-width: 768px;"><story :pinia="pinia" /></div>',
    }),
  ],
};

 