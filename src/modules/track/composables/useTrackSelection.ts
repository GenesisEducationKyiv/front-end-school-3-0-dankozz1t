import { ref, computed, type ComputedRef } from 'vue';
import type { Track } from '../types';

export function useTrackSelection() {
  // === STATE ===
  const selectedTracks = ref<string[]>([]);

  // === COMPUTED ===
  const isInBulkMode: ComputedRef<boolean> = computed(() => selectedTracks.value.length > 0);

  const selectedTrackIds: ComputedRef<string[]> = computed(() => selectedTracks.value);

  const selectedCount: ComputedRef<number> = computed(() => selectedTracks.value.length);

  // === METHODS ===
  function toggleTrackSelection(id: string): void {
    const index = selectedTracks.value.indexOf(id);
    if (index === -1) {
      selectedTracks.value.push(id);
    } else {
      selectedTracks.value.splice(index, 1);
    }
  }

  function isTrackSelected(id: string): boolean {
    return selectedTracks.value.includes(id);
  }

  function selectAllTracks(tracks: Track[]): void {
    selectedTracks.value = tracks.map(track => track.id);
  }

  function clearSelectedTracks(): void {
    selectedTracks.value = [];
  }

  function selectTracks(trackIds: string[]): void {
    selectedTracks.value = [...trackIds];
  }

  function addToSelection(trackIds: string[]): void {
    const newIds = trackIds.filter(id => !selectedTracks.value.includes(id));
    selectedTracks.value.push(...newIds);
  }

  function removeFromSelection(trackIds: string[]): void {
    selectedTracks.value = selectedTracks.value.filter(id => !trackIds.includes(id));
  }

  return {
    // State
    selectedTracks: selectedTracks,

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
