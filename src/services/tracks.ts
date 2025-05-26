import http from './http';

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

/**
 * Get all tracks with pagination, sorting, and filtering
 * @param params - Query parameters
 * @returns Tracks and metadata
 */
const getAllTracks = async (params: QueryParams = {}): Promise<PaginatedResponse<Track>> => {
  return http.get('/api/tracks', { params });
};

/**
 * Create a new track
 * @param trackData - Track data
 * @returns Created track
 */
const createTrack = async (trackData: TrackFormData): Promise<Track> => {
  return http.post('/api/tracks', trackData);
};

/**
 * Update a track
 * @param id - Track ID
 * @param trackData - Track data to update
 * @returns Updated track
 */
const updateTrack = async (id: string, trackData: Partial<TrackFormData>): Promise<Track> => {
  return http.put(`/api/tracks/${id}`, trackData);
};

/**
 * Delete a track
 * @param id - Track ID
 * @returns void
 */
const deleteTrack = async (id: string): Promise<void> => {
  return http.delete(`/api/tracks/${id}`);
};

/**
 * Delete multiple tracks
 * @param ids - Array of track IDs
 * @returns Result with success and failed IDs
 */
const deleteTracks = async (ids: string[]): Promise<BatchDeleteResponse> => {
  return http.post('/api/tracks/delete', { ids });
};

/**
 * Upload an audio file for a track
 * @param id - Track ID
 * @param file - Audio file to upload
 * @returns Updated track
 */
const uploadTrackFile = async (id: string, file: File): Promise<Track> => {
  const formData = new FormData();
  formData.append('file', file);
  return http.post(`/api/tracks/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete an audio file from a track
 * @param id - Track ID
 * @returns Updated track
 */
const deleteTrackFile = async (id: string): Promise<Track> => {
  return http.delete(`/api/tracks/${id}/file`);
};

export default {
  getAllTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  deleteTracks,
  uploadTrackFile,
  deleteTrackFile,
};
