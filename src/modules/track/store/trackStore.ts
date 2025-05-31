import { defineStore } from 'pinia';
import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { trackApi } from '../api/trackApi';
import { useTrackQueries } from '../composables/useTrackQueries';
import { useTrackSelection } from '../composables/useTrackSelection';
import type { Track, TrackFormData } from '../types';

/**
 * Track store - manages track state and operations
 * Business logic is delegated to composables for better separation of concerns
 */
export const useTrackStore = defineStore('track', () => {
  // === STATE ===
  const tracks = ref<Track[]>([]);
  const totalTracks = ref<number>(0);
  const loading = ref<boolean>(false);

  // === COMPOSABLES ===
  const trackQueries = useTrackQueries();
  const trackSelection = useTrackSelection();

  // === COMPUTED ===
  const totalPages: ComputedRef<number> = computed(() =>
    Math.ceil(totalTracks.value / trackQueries.itemsPerPage.value)
  );

  // === API ACTIONS ===
  /**
   * Fetch tracks with current filters, sorting and pagination
   */
  async function fetchTracks(): Promise<void> {
    loading.value = true;
    try {
      const params = trackQueries.buildQueryParams();
      const { data, meta } = await trackApi.getAllTracks(params);
      tracks.value = data;
      totalTracks.value = meta.total;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new track
   */
  async function createTrack(trackData: TrackFormData): Promise<Track> {
    loading.value = true;
    try {
      const newTrack = await trackApi.createTrack(trackData);
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
   */
  async function updateTrack(id: string, trackData: Partial<TrackFormData>): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.updateTrack(id, trackData);
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
   */
  async function deleteTrack(id: string): Promise<void> {
    loading.value = true;
    try {
      await trackApi.deleteTrack(id);
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
   */
  async function deleteTracks(ids: string[]): Promise<void> {
    loading.value = true;
    try {
      await trackApi.deleteTracks(ids);
      trackSelection.clearSelectedTracks();
      await fetchTracks();
    } catch (error) {
      console.error('Error deleting tracks:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Upload an audio file for a track
   */
  async function uploadTrackFile(id: string, file: File): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.uploadTrackFile(id, file);
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
   */
  async function deleteTrackFile(id: string): Promise<Track> {
    loading.value = true;
    try {
      const updatedTrack = await trackApi.deleteTrackFile(id);
      await fetchTracks();
      return updatedTrack;
    } catch (error) {
      console.error('Error deleting track file:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    tracks: tracks as Ref<Track[]>,
    totalTracks: totalTracks as Ref<number>,
    loading: loading as Ref<boolean>,

    // Computed
    totalPages,

    // Query composable
    ...trackQueries,

    // Selection composable
    ...trackSelection,

    // Actions
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    deleteTracks,
    uploadTrackFile,
    deleteTrackFile,
  };
});
