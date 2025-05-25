import http from './http';

/**
 * Get all available genres
 * @returns Promise with array of genre names
 */
const getAllGenres = async (): Promise<string[]> => {
  return http.get('/api/genres');
};

export default {
  getAllGenres,
};
