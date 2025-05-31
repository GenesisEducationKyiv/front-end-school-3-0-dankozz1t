import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { Track } from '../types';

/**
 * Composable for managing track selection for bulk operations
 */
export function useTrackSelection() {
  // === STATE ===
  const selectedTracks = ref<string[]>([]);

  // === COMPUTED ===
  const isInBulkMode: ComputedRef<boolean> = computed(() => selectedTracks.value.length > 0);

  const selectedTrackIds: ComputedRef<string[]> = computed(() => selectedTracks.value);

  const selectedCount: ComputedRef<number> = computed(() => selectedTracks.value.length);

  // === METHODS ===
  /**
   * Toggle selection of a track
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
   * Check if a track is selected
   */
  function isTrackSelected(id: string): boolean {
    return selectedTracks.value.includes(id);
  }

  /**
   * Select all tracks
   */
  function selectAllTracks(tracks: Track[]): void {
    selectedTracks.value = tracks.map(track => track.id);
  }

  /**
   * Clear all selected tracks
   */
  function clearSelectedTracks(): void {
    selectedTracks.value = [];
  }

  /**
   * Select multiple tracks by ID
   */
  function selectTracks(trackIds: string[]): void {
    selectedTracks.value = [...trackIds];
  }

  /**
   * Add tracks to selection
   */
  function addToSelection(trackIds: string[]): void {
    const newIds = trackIds.filter(id => !selectedTracks.value.includes(id));
    selectedTracks.value.push(...newIds);
  }

  /**
   * Remove tracks from selection
   */
  function removeFromSelection(trackIds: string[]): void {
    selectedTracks.value = selectedTracks.value.filter(id => !trackIds.includes(id));
  }

  return {
    // State
    selectedTracks: selectedTracks as Ref<string[]>,

    // Computed
    isInBulkMode,
    selectedTrackIds,
    selectedCount,

    // Methods
    toggleTrackSelection,
    isTrackSelected,
    selectAllTracks,
    clearSelectedTracks,
    selectTracks,
    addToSelection,
    removeFromSelection,
  };
}
