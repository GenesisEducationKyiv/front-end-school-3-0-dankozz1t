import { computed, reactive } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_TRACKS } from '../graphql/queries';
import { CREATE_TRACK, UPDATE_TRACK, DELETE_TRACK, DELETE_TRACKS } from '../graphql/mutations';
import type { Track, TrackFormData, QueryParams } from '@/modules/track/types';

export function useTrackGraphQL() {
  const queryParams = reactive<QueryParams>({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  });

  const {
    result: tracksResult,
    loading: tracksLoading,
    error: tracksError,
    refetch: refetchTracks,
  } = useQuery(GET_TRACKS, () => ({
    input: {
      page: queryParams.page,
      limit: queryParams.limit,
      sort: queryParams.sort,
      order: queryParams.order,
      search: queryParams.search || undefined,
      genre: queryParams.genre || undefined,
      artist: queryParams.artist || undefined,
    },
  }));

  const tracks = computed(() => tracksResult.value?.tracks?.data || []);
  const totalTracks = computed(() => tracksResult.value?.tracks?.meta?.total || 0);
  const totalPages = computed(() => tracksResult.value?.tracks?.meta?.totalPages || 0);
  const currentPage = computed(() => tracksResult.value?.tracks?.meta?.page || 1);

  const { mutate: createTrackMutation, loading: createLoading } = useMutation(CREATE_TRACK, {
    update: (_, { data }) => {
      if (data?.createTrack) {
        refetchTracks();
      }
    },
  });

  const { mutate: updateTrackMutation, loading: updateLoading } = useMutation(UPDATE_TRACK, {
    update: (_, { data }) => {
      if (data?.updateTrack) {
        refetchTracks();
      }
    },
  });

  const { mutate: deleteTrackMutation, loading: deleteLoading } = useMutation(DELETE_TRACK, {
    update: (_, { data }) => {
      if (data?.deleteTrack) {
        refetchTracks();
      }
    },
  });

  const { mutate: deleteTracksMutation, loading: deleteMultipleLoading } = useMutation(
    DELETE_TRACKS,
    {
      update: (_, { data }) => {
        if (data?.deleteTracks) {
          refetchTracks();
        }
      },
    }
  );

  const updateFilters = (newParams: Partial<QueryParams>) => {
    Object.assign(queryParams, newParams);
  };

  const updatePage = (page: number) => {
    queryParams.page = page;
  };

  const updateSort = (sort: string, order: 'asc' | 'desc') => {
    queryParams.sort = sort as QueryParams['sort'];
    queryParams.order = order;
  };

  const updateSearch = (search: string) => {
    queryParams.search = search || undefined;
    queryParams.page = 1;
  };

  const resetFilters = () => {
    Object.assign(queryParams, {
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
      search: undefined,
      genre: undefined,
      artist: undefined,
    });
  };

  const createTrack = async (trackData: TrackFormData): Promise<Track> => {
    const result = await createTrackMutation({ input: trackData });
    if (!result?.data?.createTrack) {
      throw new Error('Failed to create track');
    }
    return result.data.createTrack;
  };

  const updateTrack = async (id: string, trackData: Partial<TrackFormData>): Promise<Track> => {
    const result = await updateTrackMutation({ id, input: trackData });
    if (!result?.data?.updateTrack) {
      throw new Error('Failed to update track');
    }
    return result.data.updateTrack;
  };

  const deleteTrack = async (id: string): Promise<boolean> => {
    const result = await deleteTrackMutation({ id });
    return !!result?.data?.deleteTrack;
  };

  const deleteTracks = async (ids: string[]) => {
    const result = await deleteTracksMutation({ ids });
    if (!result?.data?.deleteTracks) {
      throw new Error('Failed to delete tracks');
    }
    return result.data.deleteTracks;
  };

  return {
    tracks,
    totalTracks,
    totalPages,
    currentPage,
    queryParams,

    tracksLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    deleteMultipleLoading,

    tracksError,

    updateFilters,
    updatePage,
    updateSort,
    updateSearch,
    resetFilters,
    refetchTracks,

    createTrack,
    updateTrack,
    deleteTrack,
    deleteTracks,
  };
}
