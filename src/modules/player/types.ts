import type { Track } from '../track/types';

export interface PlayerEvents {
  onTrackStart?: (track: Track) => void;
  onTrackEnd?: (track: Track) => void;
  onTrackPause?: (track: Track) => void;
  onTrackResume?: (track: Track) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: Error) => void;
}
