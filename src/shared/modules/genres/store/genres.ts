import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

import { genresApi } from '@/shared/modules/genres/api/genresApi';

export interface GenresState {
  genres: Ref<string[]>;
  loading: Ref<boolean>;
}

export const useGenresStore = defineStore('genres', () => {
  const genres = ref<string[]>([]);
  const loading = ref<boolean>(false);

  async function fetchGenres(): Promise<void> {
    loading.value = true;

    try {
      genres.value = await genresApi.getAllGenres();
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
