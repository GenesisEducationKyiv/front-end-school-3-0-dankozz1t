import http from '@/services/http';

export const genresApi = {
  async getAllGenres(): Promise<string[]> {
    return http.get('/api/genres');
  },
};
