import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

import api from '@/services/genres';

export interface GenresState {
  genres: Ref<string[]>;
  loading: Ref<boolean>;
}

export const useGenresStore = defineStore('genres', () => {
  // State
  const genres = ref<string[]>([]);
  const loading = ref<boolean>(false);

  /**
   * Fetch all available genres
   */
  async function fetchGenres(): Promise<void> {
    loading.value = true;
    try {
      genres.value = await api.getAllGenres();
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    genres,
    loading,
    fetchGenres,
  };
});
