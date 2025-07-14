import { computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_GENRES } from '../graphql/queries';

export function useGenresGraphQL() {
  const { result, loading, error, refetch } = useQuery(GET_GENRES);

  const genres = computed(() => result.value?.genres || []);

  return {
    genres,
    loading,
    error,
    refetch,
  };
}
