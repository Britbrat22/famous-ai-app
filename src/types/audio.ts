export interface AudioClip {
  id: string;
  name: string;
  url: string;
  startTime: number;
  duration: number;
  offset: number;
  color: string;
  waveformData?: number[];
}

export interface Track {
  id: string;
  name: string;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: AudioClip[];
}

export interface Project {
  id: string;
  name: string;
  bpm: number;
  timeSignature: string;
  tracks: Track[];
  duration: number;
}

export interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  loopStart: number;
  loopEnd: number;
  loopEnabled: boolean;
}
