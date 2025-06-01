import { defineStore } from 'pinia';
import { ref, computed, type ComputedRef, type Ref } from 'vue';
import api, { type Track, type TrackFormData, type QueryParams } from '@/services/tracks';
import { useAudioPlayer } from '@/modules/player/composables/useAudioPlayer';

export interface TracksState {
  tracks: Ref<Track[]>;
  totalTracks: Ref<number>;
  currentPage: Ref<number>;
  itemsPerPage: Ref<number>;
  loading: Ref<boolean>;
  sortBy: Ref<string>;
  sortOrder: Ref<'asc' | 'desc'>;
  searchQuery: Ref<string>;
  selectedGenre: Ref<string>;
  selectedArtist: Ref<string>;
  selectedTracks: Ref<string[]>;
}

export const useTracksStore = defineStore('tracks', () => {
  // === STATE ===
  const tracks = ref<Track[]>([]);
  const totalTracks = ref<number>(0);
  const currentPage = ref<number>(1);
  const itemsPerPage = ref<number>(10);
  const loading = ref<boolean>(false);
  const sortBy = ref<string>('createdAt');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const searchQuery = ref<string>('');
  const selectedGenre = ref<string | null>(null);
  const selectedArtist = ref<string | null>(null);
  const selectedTracks = ref<string[]>([]);

  const audioPlayer = useAudioPlayer();

  // === COMPUTED ===
  const totalPages: ComputedRef<number> = computed(() =>
    Math.ceil(totalTracks.value / itemsPerPage.value)
  );
  const hasAudioPlaying: ComputedRef<boolean> = computed(() => !!audioPlayer.currentAudio.value);
  const isInBulkMode: ComputedRef<boolean> = computed(() => selectedTracks.value.length > 0);

  // === QUERY ACTIONS ===
  /**
   * Fetch tracks with current filters, sorting and pagination
   */
  async function fetchTracks(): Promise<void> {
    loading.value = true;
    try {
      const params: QueryParams = buildQueryParams();
      const { data, meta } = await api.getAllTracks(params);
      tracks.value = data;
      totalTracks.value = meta.total;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function buildQueryParams(): QueryParams {
    const params: QueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort: sortBy.value as 'title' | 'artist' | 'album' | 'createdAt',
      order: sortOrder.value,
    };

    if (searchQuery.value && searchQuery.value.trim() !== '') {
      params.search = searchQuery.value.trim();
    }

    if (selectedGenre.value) {
      params.genre = selectedGenre.value;
    }

    if (selectedArtist.value) {
      params.artist = selectedArtist.value;
    }

    return params;
  }

  // === TRACK CRUD ACTIONS ===
  /**
   * Create a new track
   * @param trackData - Track data object
   */
  async function createTrack(trackData: TrackFormData): Promise<Track> {
    loading.value = true;
    try {
      const newTrack = await api.createTrack(trackData);
      await fetchTracks();
      return newTrack;
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing track
   * @param id - Track ID
   * @param trackData - Track data to update
   */
  async function updateTrack(id: string, trackData: Partial<TrackFormData>): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await api.updateTrack(id, trackData);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a track
   * @param id - Track ID
   */
  async function deleteTrack(id: string): Promise<void> {
    loading.value = true;
    try {
      // Stop the audio if the deleted track is currently playing
      if (audioPlayer.currentTrack.value && audioPlayer.currentTrack.value.id === id) {
        audioPlayer.stopTrack();
      }

      await api.deleteTrack(id);
      await fetchTracks();
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete multiple tracks
   * @param ids - Array of track IDs
   */
  async function deleteTracks(ids: string[]): Promise<void> {
    loading.value = true;
    try {
      // Stop the audio if the deleted track is currently playing
      if (audioPlayer.currentTrack.value && ids.includes(audioPlayer.currentTrack.value.id)) {
        audioPlayer.stopTrack();
      }

      await api.deleteTracks(ids);
      selectedTracks.value = [];
      await fetchTracks();
    } catch (error) {
      console.error('Error deleting tracks:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // === FILE OPERATIONS ===
  /**
   * Upload an audio file for a track
   * @param id - Track ID
   * @param file - Audio file to upload
   */
  async function uploadTrackFile(id: string, file: File): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await api.uploadTrackFile(id, file);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error uploading track file:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete an audio file from a track
   * @param id - Track ID
   */
  async function deleteTrackFile(id: string): Promise<Track> {
    loading.value = true;
    try {
      // Stop the audio if this track is currently playing
      if (audioPlayer.currentTrack.value && audioPlayer.currentTrack.value.id === id) {
        audioPlayer.stopTrack();
      }

      const updatedTrack = await api.deleteTrackFile(id);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error deleting track file:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Play an audio track
   * @param track - Track to play
   */
  async function playTrack(track: Track): Promise<void> {
    await audioPlayer.playTrack(track);
  }

  /**
   * Stop the currently playing track
   */
  function stopTrack(): void {
    audioPlayer.stopTrack();
  }

  // === SELECTION MANAGEMENT ===
  /**
   * Toggle selection of a track for bulk operations
   * @param id - Track ID
   */
  function toggleTrackSelection(id: string): void {
    const index = selectedTracks.value.indexOf(id);
    if (index === -1) {
      selectedTracks.value.push(id);
    } else {
      selectedTracks.value.splice(index, 1);
    }
  }

  /**
   * Select all tracks
   */
  function selectAllTracks(): void {
    selectedTracks.value = tracks.value.map(track => track.id);
  }

  /**
   * Clear all selected tracks
   */
  function clearSelectedTracks(): void {
    selectedTracks.value = [];
  }

  /**
   * Reset all filters and sorting
   */
  function resetFilters(): void {
    searchQuery.value = '';
    selectedGenre.value = '';
    selectedArtist.value = '';
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
    currentPage.value = 1;
  }

  return {
    // State
    tracks,
    totalTracks,
    currentPage,
    itemsPerPage,
    loading,
    sortBy,
    sortOrder,
    searchQuery,
    selectedGenre,
    selectedArtist,
    selectedTracks,

    // Computed
    totalPages,
    hasAudioPlaying,
    isInBulkMode,

    // Audio player state and methods (except loading which is defined above)
    currentTrack: audioPlayer.currentTrack,
    currentAudio: audioPlayer.currentAudio,
    currentTime: audioPlayer.currentTime,
    duration: audioPlayer.duration,
    volume: audioPlayer.volume,

    // Actions
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    deleteTracks,
    uploadTrackFile,
    deleteTrackFile,
    playTrack,
    stopTrack,
    toggleTrackSelection,
    selectAllTracks,
    clearSelectedTracks,
    resetFilters,
  };
});
