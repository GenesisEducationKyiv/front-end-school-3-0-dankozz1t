/**
 * UNIT TEST: VITEST - API LAYER
 * Tests the trackApi service layer with mocked HTTP client.
 * Verifies CRUD operations, query parameter handling, file uploads, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackApi } from '../../../src/modules/track/api/trackApi';
import type { Track, QueryParams, PaginatedResponse } from '../../../src/modules/track/types';
import { 
  createMockTrack, 
  createMockTrackFormData, 
} from '../../utils/testUtils';

vi.mock('../../../src/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedHttp = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../../src/services/http', () => ({ default: mockedHttp }));

describe('Track API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTracks', () => {
    it('should fetch tracks with default parameters', async () => {
      const mockTracks = [createMockTrack(), createMockTrack({ id: 'track-2', title: 'Track 2' })];
      const mockResponse: PaginatedResponse<Track> = {
        data: mockTracks,
        meta: {
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      mockedHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await trackApi.getAllTracks();

      expect(mockedHttp.get).toHaveBeenCalledWith('/api/tracks', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch tracks with custom query parameters', async () => {
      const queryParams: QueryParams = {
        page: 2,
        limit: 10,
        search: 'rock music',
        sort: 'title',
        order: 'asc',
        genre: 'Rock',
        artist: 'Test Artist',
      };

      const mockResponse: PaginatedResponse<Track> = {
        data: [],
        meta: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
        },
      };

      mockedHttp.get.mockResolvedValueOnce(mockResponse);

      await trackApi.getAllTracks(queryParams);

      expect(mockedHttp.get).toHaveBeenCalledWith('/api/tracks', { params: queryParams });
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockedHttp.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.getAllTracks()).rejects.toThrow(errorMessage);
    });
  });

  describe('createTrack', () => {
    it('should create a new track', async () => {
      const trackData = createMockTrackFormData();
      const mockTrack = createMockTrack();

      mockedHttp.post.mockResolvedValueOnce(mockTrack);

      const result = await trackApi.createTrack(trackData);

      expect(mockedHttp.post).toHaveBeenCalledWith('/api/tracks', trackData);
      expect(result).toEqual(mockTrack);
    });

    it('should handle validation errors', async () => {
      const trackData = createMockTrackFormData({ title: '' });
      const errorMessage = 'Title is required';

      mockedHttp.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.createTrack(trackData)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateTrack', () => {
    it('should update an existing track', async () => {
      const trackId = 'track-1';
      const updateData = { title: 'Updated Title' };
      const updatedTrack = createMockTrack({ title: 'Updated Title' });

      mockedHttp.put.mockResolvedValueOnce(updatedTrack);

      const result = await trackApi.updateTrack(trackId, updateData);

      expect(mockedHttp.put).toHaveBeenCalledWith(`/api/tracks/${trackId}`, updateData);
      expect(result).toEqual(updatedTrack);
    });

    it('should handle not found errors', async () => {
      const trackId = 'non-existent';
      const updateData = { title: 'Updated Title' };
      const errorMessage = 'Track not found';

      mockedHttp.put.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.updateTrack(trackId, updateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteTrack', () => {
    it('should delete a track', async () => {
      const trackId = 'track-1';

      mockedHttp.delete.mockResolvedValueOnce(undefined);

      await trackApi.deleteTrack(trackId);

      expect(mockedHttp.delete).toHaveBeenCalledWith(`/api/tracks/${trackId}`);
    });

    it('should handle deletion errors', async () => {
      const trackId = 'track-1';
      const errorMessage = 'Internal server error';

      mockedHttp.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.deleteTrack(trackId)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteTracks', () => {
    it('should delete multiple tracks', async () => {
      const trackIds = ['track-1', 'track-2', 'track-3'];
      const mockResponse = { success: trackIds, failed: [] };

      mockedHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await trackApi.deleteTracks(trackIds);

      expect(mockedHttp.post).toHaveBeenCalledWith('/api/tracks/delete', { ids: trackIds });
      expect(result).toEqual(mockResponse);
    });

    it('should handle bulk deletion errors', async () => {
      const trackIds = ['track-1', 'track-2'];
      const errorMessage = 'Some tracks could not be deleted';

      mockedHttp.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.deleteTracks(trackIds)).rejects.toThrow(errorMessage);
    });
  });

  describe('uploadTrackFile', () => {
    it('should upload a track file', async () => {
      const trackId = 'track-1';
      const file = new File(['audio data'], 'song.mp3', { type: 'audio/mpeg' });
      const updatedTrack = createMockTrack({ audioFile: 'https://example.com/song.mp3' });

      mockedHttp.post.mockResolvedValueOnce(updatedTrack);

      const result = await trackApi.uploadTrackFile(trackId, file);

      expect(mockedHttp.post).toHaveBeenCalledWith(
        `/api/tracks/${trackId}/upload`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(updatedTrack);
    });

    it('should handle file upload errors', async () => {
      const trackId = 'track-1';
      const file = new File([''], 'empty.mp3', { type: 'audio/mpeg' });
      const errorMessage = 'File too large';

      mockedHttp.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(trackApi.uploadTrackFile(trackId, file)).rejects.toThrow(errorMessage);
    });

    it('should create proper FormData for file upload', async () => {
      const trackId = 'track-1';
      const file = new File(['audio data'], 'song.mp3', { type: 'audio/mpeg' });
      const mockTrack = createMockTrack();

      let capturedFormData: FormData | undefined;
      mockedHttp.post.mockImplementationOnce((_: string, data: FormData) => {
        capturedFormData = data;
        return Promise.resolve(mockTrack);
      });

      await trackApi.uploadTrackFile(trackId, file);

      expect(capturedFormData).toBeInstanceOf(FormData);
      expect(capturedFormData?.get('file')).toBe(file);
    });
  });

  describe('deleteTrackFile', () => {
    it('should delete a track file', async () => {
      const trackId = 'track-1';
      const updatedTrack = createMockTrack({ audioFile: undefined });

      mockedHttp.delete.mockResolvedValueOnce(updatedTrack);

      const result = await trackApi.deleteTrackFile(trackId);

      expect(mockedHttp.delete).toHaveBeenCalledWith(`/api/tracks/${trackId}/file`);
      expect(result).toEqual(updatedTrack);
    });
  });
}); 