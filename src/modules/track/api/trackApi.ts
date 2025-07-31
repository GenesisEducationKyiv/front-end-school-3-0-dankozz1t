import http from '@/services/http';
import type {
  Track,
  TrackFormData,
  PaginatedResponse,
  QueryParams,
  BatchDeleteResponse,
} from '@/modules/track/types';

export const trackApi = {
  async getAllTracks(params: QueryParams = {}): Promise<PaginatedResponse<Track>> {
    return http.get('/api/tracks', { params });
  },

  async createTrack(trackData: TrackFormData): Promise<Track> {
    return http.post('/api/tracks', trackData);
  },

  async updateTrack(id: string, trackData: Partial<TrackFormData>): Promise<Track> {
    return http.put(`/api/tracks/${id}`, trackData);
  },

  async deleteTrack(id: string): Promise<void> {
    return http.delete(`/api/tracks/${id}`);
  },

  async deleteTracks(ids: string[]): Promise<BatchDeleteResponse> {
    return http.post('/api/tracks/delete', { ids });
  },

  async uploadTrackFile(id: string, file: File): Promise<Track> {
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`/api/tracks/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteTrackFile(id: string): Promise<Track> {
    return http.delete(`/api/tracks/${id}/file`);
  },
};
