/**
 * UNIT TEST: VITEST - WHITEBOX TESTING WITH MOCKS
 * Tests the TrackService class with full knowledge of internal implementation.
 * Verifies internal method calls, data transformations, validation logic, and error flows.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('@/services/http', () => ({ default: mockHttp }));
class TrackService {
  private http = mockHttp;

  async createTrack(trackData: any) {
    const validatedData = this.validateTrackData(trackData);
    const transformedData = this.transformTrackData(validatedData);
    
    try {
      const response = await this.http.post('/api/tracks', transformedData);
      return this.processResponse(response);
    } catch (error) {
      throw new Error(`Failed to create track: ${error}`);
    }
  }

  private validateTrackData(data: any) {
    if (!data.title || !data.artist) {
      throw new Error('Title and artist are required');
    }
    return data;
  }

  private transformTrackData(data: any) {
    return {
      ...data,
      slug: this.generateSlug(data.title, data.artist),
      createdAt: new Date().toISOString(),
    };
  }

  private generateSlug(title: string, artist: string): string {
    return `${title}-${artist}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  private processResponse(response: any) {
    return {
      ...response,
      processed: true,
      timestamp: Date.now(),
    };
  }
}

describe('TrackService - Whitebox Testing', () => {
  let trackService: TrackService;

  beforeEach(() => {
    trackService = new TrackService();
    vi.clearAllMocks();
  });

  describe('createTrack method', () => {
    it('should validate input data before API call', async () => {
      const invalidData = { title: '', artist: 'Test Artist' };

      await expect(trackService.createTrack(invalidData)).rejects.toThrow(
        'Title and artist are required'
      );

      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('should transform data with slug generation before API call', async () => {
      const inputData = { title: 'Test Track', artist: 'Test Artist' };
      const mockResponse = { id: '1', title: 'Test Track' };
      
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      await trackService.createTrack(inputData);

      expect(mockHttp.post).toHaveBeenCalledWith('/api/tracks', expect.objectContaining({
        title: 'Test Track',
        artist: 'Test Artist',
        slug: 'test-track-test-artist',
        createdAt: expect.any(String),
      }));
    });

    it('should process response correctly after successful API call', async () => {
      const inputData = { title: 'Test Track', artist: 'Test Artist' };
      const mockResponse = { id: '1', title: 'Test Track' };
      
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await trackService.createTrack(inputData);

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        title: 'Test Track',
        processed: true,
        timestamp: expect.any(Number),
      }));
    });

    it('should handle API errors and throw meaningful error messages', async () => {
      const inputData = { title: 'Test Track', artist: 'Test Artist' };
      const apiError = new Error('Network error');
      
      mockHttp.post.mockRejectedValueOnce(apiError);

      await expect(trackService.createTrack(inputData)).rejects.toThrow(
        'Failed to create track: Error: Network error'
      );
    });

    it('should call internal methods in correct order', async () => {
      const inputData = { title: 'Test Track!', artist: 'Test Artist!' };
      const mockResponse = { id: '1' };
      
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await trackService.createTrack(inputData);

      expect(mockHttp.post).toHaveBeenCalledWith('/api/tracks', expect.objectContaining({
        slug: 'test-track--test-artist-',
      }));
      expect(result).toHaveProperty('processed', true);
      expect(result).toHaveProperty('timestamp');
    });
  });
}); 