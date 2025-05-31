import http from '@/services/http';
import type {
  Track,
  TrackFormData,
  PaginatedResponse,
  QueryParams,
  BatchDeleteResponse,
} from '../types';

/**
 * Track API service - handles all HTTP requests for track operations
 */
export const trackApi = {
  /**
   * Get all tracks with pagination, sorting, and filtering
   */
  async getAllTracks(params: QueryParams = {}): Promise<PaginatedResponse<Track>> {
    return http.get('/api/tracks', { params });
  },

  /**
   * Create a new track
   */
  async createTrack(trackData: TrackFormData): Promise<Track> {
    return http.post('/api/tracks', trackData);
  },

  /**
   * Update a track
   */
  async updateTrack(id: string, trackData: Partial<TrackFormData>): Promise<Track> {
    return http.put(`/api/tracks/${id}`, trackData);
  },

  /**
   * Delete a track
   */
  async deleteTrack(id: string): Promise<void> {
    return http.delete(`/api/tracks/${id}`);
  },

  /**
   * Delete multiple tracks
   */
  async deleteTracks(ids: string[]): Promise<BatchDeleteResponse> {
    return http.post('/api/tracks/delete', { ids });
  },

  /**
   * Upload an audio file for a track
   */
  async uploadTrackFile(id: string, file: File): Promise<Track> {
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`/api/tracks/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete an audio file from a track
   */
  async deleteTrackFile(id: string): Promise<Track> {
    return http.delete(`/api/tracks/${id}/file`);
  },
};
