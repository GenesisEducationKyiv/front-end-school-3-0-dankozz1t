export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackFormData {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export interface BatchDeleteResponse {
  success: string[];
  failed: string[];
}

export interface TrackFilters {
  searchQuery: string;
  selectedGenre: string | null;
  selectedArtist: string | null;
}

export interface TrackSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface TrackPagination {
  currentPage: number;
  itemsPerPage: number;
  totalTracks: number;
}

// Enhanced types for track management

// Track validation
export interface TrackValidationError {
  field: keyof TrackFormData;
  message: string;
  code?: string;
}

export interface TrackValidationResult {
  valid: boolean;
  errors: TrackValidationError[];
}

// Track selection
export interface TrackSelection {
  selectedTracks: Track[];
  selectedTrackIds: string[];
  isInBulkMode: boolean;
  selectedCount: number;
}

// Track query composable return type
export interface TrackQueryState {
  searchQuery: { value: string };
  selectedGenre: { value: string | null };
  selectedArtist: { value: string | null };
  sortBy: { value: string };
  sortOrder: { value: 'asc' | 'desc' };
  currentPage: { value: number };
  itemsPerPage: { value: number };
}

// File upload specific types
export interface TrackFileUpload {
  trackId: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Type guards
export const isTrack = (obj: unknown): obj is Track => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'artist' in obj &&
    'genres' in obj &&
    'slug' in obj &&
    'createdAt' in obj &&
    'updatedAt' in obj &&
    typeof (obj as Track).id === 'string' &&
    typeof (obj as Track).title === 'string' &&
    typeof (obj as Track).artist === 'string' &&
    Array.isArray((obj as Track).genres) &&
    typeof (obj as Track).slug === 'string' &&
    typeof (obj as Track).createdAt === 'string' &&
    typeof (obj as Track).updatedAt === 'string'
  );
};

export const isTrackFormData = (obj: unknown): obj is TrackFormData => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'title' in obj &&
    'artist' in obj &&
    'genres' in obj &&
    typeof (obj as TrackFormData).title === 'string' &&
    typeof (obj as TrackFormData).artist === 'string' &&
    Array.isArray((obj as TrackFormData).genres)
  );
};

export const isPaginatedResponse = <T>(obj: unknown): obj is PaginatedResponse<T> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    'meta' in obj &&
    Array.isArray((obj as PaginatedResponse<T>).data) &&
    typeof (obj as PaginatedResponse<T>).meta === 'object'
  );
};

// Utility types
export type TrackUpdateData = Partial<TrackFormData>;
export type TrackSortField = NonNullable<QueryParams['sort']>;
export type TrackSortOrder = NonNullable<QueryParams['order']>;

// Genre and artist extract utilities
export type TrackGenre = string;
export type TrackArtist = string;

// Read-only track type for display
export type ReadonlyTrack = Readonly<Track>;

// Track with computed properties
export interface EnhancedTrack extends Track {
  isPlaying?: boolean;
  isSelected?: boolean;
  duration?: number;
}
