import type { Track } from '../track/types';

export interface PlayerState {
  currentTrack: Track | null;
  currentAudio: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
}

export interface PlaybackControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

export interface PlayerEvents {
  onTrackStart?: (track: Track) => void;
  onTrackEnd?: (track: Track) => void;
  onTrackPause?: (track: Track) => void;
  onTrackResume?: (track: Track) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: Error) => void;
}

// Audio player configuration
export interface AudioPlayerConfig {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  preload?: 'none' | 'metadata' | 'auto';
}

// Player error types
export type PlayerErrorType =
  | 'NETWORK_ERROR'
  | 'DECODE_ERROR'
  | 'SRC_NOT_SUPPORTED'
  | 'ABORTED'
  | 'UNKNOWN';

export interface PlayerError extends Error {
  type: PlayerErrorType;
  originalError?: Event;
}

// Audio format support
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac' | 'm4a';

export interface AudioFormatSupport {
  mp3: boolean;
  wav: boolean;
  ogg: boolean;
  aac: boolean;
  flac: boolean;
  m4a: boolean;
}

// Playback state
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error';

// Type guards
export const isTrackValid = (track: unknown): track is Track => {
  return (
    typeof track === 'object' &&
    track !== null &&
    'id' in track &&
    'title' in track &&
    'artist' in track &&
    typeof (track as Track).id === 'string' &&
    typeof (track as Track).title === 'string' &&
    typeof (track as Track).artist === 'string'
  );
};

export const isPlayerError = (error: unknown): error is PlayerError => {
  return (
    error instanceof Error && 'type' in error && typeof (error as PlayerError).type === 'string'
  );
};

// Utility type for readonly player state
export type ReadonlyPlayerState = Readonly<PlayerState>;

// Hook return type
export interface UseAudioPlayerReturn extends PlayerState, PlaybackControls {
  isTrackPlaying: (trackId: string) => boolean;
  isTrackPaused: (trackId: string) => boolean;
  isTrackLoaded: (trackId: string) => boolean;
  playTrack: (track: Track) => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => void;
  setCurrentTime: (time: number) => void;
}
