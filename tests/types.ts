export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackFormData {
  title: string;
  artist: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
}

export interface TracksStore {
  tracks: Track[];
  loading: boolean;
  selectedTracks: string[];
  currentTrack: Track | null;
  hasAudioPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  searchQuery: string;
  currentPage: number;
  totalPages: number;

  fetchTracks: () => Promise<void>;
  createTrack: (track: TrackFormData) => Promise<Track>;
  updateTrack: (id: string, track: Partial<TrackFormData>) => Promise<Track>;
  playTrack: (track: Track) => Promise<void>;
  stopTrack: () => void;
  toggleTrackSelection: (id: string) => void;
  clearSelectedTracks: () => void;
}

export interface NotificationStore {
  notify: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export interface VisiblePoolStore {
  addVisibleItem: (name: string, props?: Record<string, any>) => void;
  removeVisibleItem: (name: string) => void;
}

export interface UseDebounceReturn<T> {
  value: T;
  debouncedValue: T;
}
