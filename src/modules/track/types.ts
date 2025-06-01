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

// Utility types
export type TrackSortField = NonNullable<QueryParams['sort']>;
export type TrackSortOrder = NonNullable<QueryParams['order']>;
