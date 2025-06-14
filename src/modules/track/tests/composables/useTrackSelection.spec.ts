import { describe, it, expect, beforeEach } from 'vitest';
import { useTrackSelection } from '../../composables/useTrackSelection';
import type { Track } from '../../types';

// Inline mock factory
const createMockTrack = (overrides: Partial<Track> = {}): Track => ({
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock', 'Alternative'],
  slug: 'test-track',
  coverImage: 'https://example.com/cover.jpg',
  audioFile: 'https://example.com/audio.mp3',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('useTrackSelection', () => {
  const mockTracks = [
    createMockTrack({ id: 'track-1', title: 'Track 1' }),
    createMockTrack({ id: 'track-2', title: 'Track 2' }),
    createMockTrack({ id: 'track-3', title: 'Track 3' }),
  ];

  let trackSelection: ReturnType<typeof useTrackSelection>;

  beforeEach(() => {
    trackSelection = useTrackSelection();
  });

  describe('initial state', () => {
    it('should start with no selected tracks', () => {
      expect(trackSelection.isInBulkMode.value).toBe(false);
      expect(trackSelection.selectedCount.value).toBe(0);
    });

    it('should initialize selectedTracks as empty array', () => {
      expect(trackSelection.selectedTracks.value).toEqual([]);
    });
  });

  describe('toggleTrackSelection', () => {
    it('should select a track when not selected', () => {
      trackSelection.toggleTrackSelection('track-1');

      expect(trackSelection.isInBulkMode.value).toBe(true);
      expect(trackSelection.selectedCount.value).toBe(1);
      expect(trackSelection.isTrackSelected('track-1')).toBe(true);
    });

    it('should deselect a track when already selected', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.toggleTrackSelection('track-1');

      expect(trackSelection.isInBulkMode.value).toBe(false);
      expect(trackSelection.selectedCount.value).toBe(0);
      expect(trackSelection.isTrackSelected('track-1')).toBe(false);
    });

    it('should handle multiple selections', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.toggleTrackSelection('track-2');

      expect(trackSelection.selectedCount.value).toBe(2);
      expect(trackSelection.isInBulkMode.value).toBe(true);
      expect(trackSelection.isTrackSelected('track-1')).toBe(true);
      expect(trackSelection.isTrackSelected('track-2')).toBe(true);
      expect(trackSelection.isTrackSelected('track-3')).toBe(false);
    });
  });

  describe('selectAllTracks', () => {
    it('should select all provided tracks', () => {
      trackSelection.selectAllTracks(mockTracks);

      expect(trackSelection.selectedCount.value).toBe(3);
      expect(trackSelection.isInBulkMode.value).toBe(true);
    });

    it('should handle empty tracks array', () => {
      trackSelection.selectAllTracks([]);

      expect(trackSelection.isInBulkMode.value).toBe(false);
    });

    it('should replace existing selection', () => {
      trackSelection.toggleTrackSelection('other-track');
      trackSelection.selectAllTracks(mockTracks);
    });
  });

  describe('clearSelectedTracks', () => {
    it('should clear all selected tracks', () => {
      trackSelection.selectAllTracks(mockTracks);
      trackSelection.clearSelectedTracks();

      expect(trackSelection.isInBulkMode.value).toBe(false);
      expect(trackSelection.selectedCount.value).toBe(0);
    });

    it('should work when no tracks are selected', () => {
      trackSelection.clearSelectedTracks();

      expect(trackSelection.isInBulkMode.value).toBe(false);
    });
  });

  describe('isTrackSelected', () => {
    it('should return true for selected tracks', () => {
      trackSelection.toggleTrackSelection('track-1');

      expect(trackSelection.isTrackSelected('track-1')).toBe(true);
      expect(trackSelection.isTrackSelected('track-2')).toBe(false);
    });

    it('should return false for non-selected tracks', () => {
      expect(trackSelection.isTrackSelected('non-existent')).toBe(false);
    });
  });

  describe('selectTracks', () => {
    it('should select specific tracks by ID', () => {
      trackSelection.selectTracks(['track-1', 'track-3']);

      expect(trackSelection.selectedCount.value).toBe(2);
      expect(trackSelection.isInBulkMode.value).toBe(true);
    });

    it('should replace existing selection', () => {
      trackSelection.toggleTrackSelection('track-2');
      trackSelection.selectTracks(['track-1', 'track-3']);
    });
  });

  describe('addToSelection', () => {
    it('should add new tracks to selection', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.addToSelection(['track-2', 'track-3']);

      expect(trackSelection.selectedCount.value).toBe(3);
    });

    it('should not add duplicate tracks', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.addToSelection(['track-1', 'track-2']);

      expect(trackSelection.selectedCount.value).toBe(2);
    });

    it('should handle empty array', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.addToSelection([]);
    });
  });

  describe('removeFromSelection', () => {
    it('should remove specified tracks from selection', () => {
      trackSelection.selectAllTracks(mockTracks);
      trackSelection.removeFromSelection(['track-1', 'track-3']);

      expect(trackSelection.selectedCount.value).toBe(1);
    });

    it('should handle removing non-selected tracks', () => {
      trackSelection.toggleTrackSelection('track-1');
      trackSelection.removeFromSelection(['track-2', 'track-3']);
    });

    it('should handle empty array', () => {
      trackSelection.selectAllTracks(mockTracks);
      trackSelection.removeFromSelection([]);
    });
  });

  describe('computed properties reactivity', () => {
    it('should update isInBulkMode when selection changes', () => {
      expect(trackSelection.isInBulkMode.value).toBe(false);

      trackSelection.toggleTrackSelection('track-1');
      expect(trackSelection.isInBulkMode.value).toBe(true);

      trackSelection.clearSelectedTracks();
      expect(trackSelection.isInBulkMode.value).toBe(false);
    });

    it('should update selectedCount reactively', () => {
      expect(trackSelection.selectedCount.value).toBe(0);

      trackSelection.addToSelection(['track-1', 'track-2']);
      expect(trackSelection.selectedCount.value).toBe(2);

      trackSelection.removeFromSelection(['track-1']);
      expect(trackSelection.selectedCount.value).toBe(1);
    });
  });
});
