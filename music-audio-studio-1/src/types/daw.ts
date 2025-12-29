export interface AudioClip {
  id: string;
  name: string;
  url: string;
  startTime: number; // in seconds
  duration: number;
  offset: number; // clip start offset
  color: string;
  waveformData?: number[];
}

export interface Track {
  id: string;
  name: string;
  color: string;
  volume: number; // 0-1
  pan: number; // -1 to 1
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: AudioClip[];
  effects: Effect[];
  eq: EQSettings;
}

export interface Effect {
  id: string;
  type: 'reverb' | 'delay' | 'compressor' | 'chorus' | 'distortion' | 'filter';
  enabled: boolean;
  params: Record<string, number>;
}

export interface EQSettings {
  low: number; // -12 to 12
  mid: number;
  high: number;
}

export interface Project {
  id: string;
  name: string;
  bpm: number;
  timeSignature: string;
  tracks: Track[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  loopStart: number;
  loopEnd: number;
  loopEnabled: boolean;
}

export interface DAWState {
  project: Project;
  transport: TransportState;
  zoom: number; // pixels per second
  scrollX: number;
  selectedTrackId: string | null;
  selectedClipId: string | null;
  tool: 'select' | 'cut' | 'draw';
  snapEnabled: boolean;
  snapValue: number; // in beats
}
