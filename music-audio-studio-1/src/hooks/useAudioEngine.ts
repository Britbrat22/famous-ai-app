import { useState, useRef, useCallback, useEffect } from 'react';
import { Track, AudioClip } from '@/types/daw';

interface AudioBufferMap {
  [clipId: string]: AudioBuffer;
}

interface AudioSourceMap {
  [clipId: string]: AudioBufferSourceNode;
}

interface GainNodeMap {
  [trackId: string]: GainNode;
}

interface PanNodeMap {
  [trackId: string]: StereoPannerNode;
}

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const buffersRef = useRef<AudioBufferMap>({});
  const sourcesRef = useRef<AudioSourceMap>({});
  const gainNodesRef = useRef<GainNodeMap>({});
  const panNodesRef = useRef<PanNodeMap>({});
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [analyserData, setAnalyserData] = useState<Uint8Array>(new Uint8Array(128));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      masterGainRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  const loadAudioBuffer = useCallback(async (clipId: string, url: string): Promise<AudioBuffer | null> => {
    const ctx = initAudioContext();
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      buffersRef.current[clipId] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.error('Error loading audio:', error);
      return null;
    }
  }, [initAudioContext]);

  const getWaveformData = useCallback(async (url: string): Promise<number[]> => {
    const ctx = initAudioContext();
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      const channelData = audioBuffer.getChannelData(0);
      const samples = 200;
      const blockSize = Math.floor(channelData.length / samples);
      const waveform: number[] = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channelData[i * blockSize + j]);
        }
        waveform.push(sum / blockSize);
      }
      
      const max = Math.max(...waveform);
      return waveform.map(v => v / max);
    } catch (error) {
      console.error('Error generating waveform:', error);
      return [];
    }
  }, [initAudioContext]);

  const createTrackNodes = useCallback((track: Track) => {
    const ctx = initAudioContext();
    
    if (!gainNodesRef.current[track.id]) {
      const gainNode = ctx.createGain();
      const panNode = ctx.createStereoPanner();
      
      gainNode.connect(panNode);
      panNode.connect(masterGainRef.current!);
      
      gainNodesRef.current[track.id] = gainNode;
      panNodesRef.current[track.id] = panNode;
    }
    
    gainNodesRef.current[track.id].gain.value = track.muted ? 0 : track.volume;
    panNodesRef.current[track.id].pan.value = track.pan;
    
    return gainNodesRef.current[track.id];
  }, [initAudioContext]);

  const playClip = useCallback((clip: AudioClip, trackId: string, startOffset: number = 0) => {
    const ctx = initAudioContext();
    const buffer = buffersRef.current[clip.id];
    
    if (!buffer) return;
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = gainNodesRef.current[trackId];
    if (gainNode) {
      source.connect(gainNode);
    } else {
      source.connect(masterGainRef.current!);
    }
    
    const clipOffset = Math.max(0, startOffset - clip.startTime);
    const when = Math.max(0, clip.startTime - startOffset);
    
    source.start(ctx.currentTime + when, clip.offset + clipOffset);
    sourcesRef.current[clip.id] = source;
  }, [initAudioContext]);

  const play = useCallback((tracks: Track[], fromTime: number = 0) => {
    const ctx = initAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Create track nodes
    tracks.forEach(track => {
      createTrackNodes(track);
    });
    
    // Play all clips
    tracks.forEach(track => {
      if (!track.muted) {
        track.clips.forEach(clip => {
          if (buffersRef.current[clip.id]) {
            playClip(clip, track.id, fromTime);
          }
        });
      }
    });
    
    startTimeRef.current = ctx.currentTime - fromTime;
    setIsPlaying(true);
  }, [initAudioContext, createTrackNodes, playClip]);

  const stop = useCallback(() => {
    Object.values(sourcesRef.current).forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    sourcesRef.current = {};
    
    if (audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    }
    
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    if (audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    }
    stop();
  }, [stop]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        setIsRecording(false);
        resolve(blob);
      };
      
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, []);

  const updateTrackVolume = useCallback((trackId: string, volume: number, muted: boolean) => {
    if (gainNodesRef.current[trackId]) {
      gainNodesRef.current[trackId].gain.value = muted ? 0 : volume;
    }
  }, []);

  const updateTrackPan = useCallback((trackId: string, pan: number) => {
    if (panNodesRef.current[trackId]) {
      panNodesRef.current[trackId].pan.value = pan;
    }
  }, []);

  const getAnalyserData = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return new Uint8Array(128);
  }, []);

  // Update current time while playing
  useEffect(() => {
    let animationId: number;
    
    const updateTime = () => {
      if (isPlaying && audioContextRef.current) {
        setCurrentTime(audioContextRef.current.currentTime - startTimeRef.current);
        setAnalyserData(getAnalyserData());
      }
      animationId = requestAnimationFrame(updateTime);
    };
    
    if (isPlaying) {
      animationId = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, getAnalyserData]);

  const exportMix = useCallback(async (tracks: Track[], duration: number): Promise<Blob> => {
    const ctx = new OfflineAudioContext(2, duration * 44100, 44100);
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    
    for (const track of tracks) {
      if (track.muted) continue;
      
      const gainNode = ctx.createGain();
      const panNode = ctx.createStereoPanner();
      gainNode.gain.value = track.volume;
      panNode.pan.value = track.pan;
      gainNode.connect(panNode);
      panNode.connect(masterGain);
      
      for (const clip of track.clips) {
        const buffer = buffersRef.current[clip.id];
        if (buffer) {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(gainNode);
          source.start(clip.startTime, clip.offset);
        }
      }
    }
    
    const renderedBuffer = await ctx.startRendering();
    
    // Convert to WAV
    const wavBlob = audioBufferToWav(renderedBuffer);
    return wavBlob;
  }, []);

  return {
    isPlaying,
    isRecording,
    currentTime,
    analyserData,
    play,
    pause,
    stop,
    loadAudioBuffer,
    getWaveformData,
    startRecording,
    stopRecording,
    updateTrackVolume,
    updateTrackPan,
    exportMix,
    setCurrentTime: (time: number) => {
      pauseTimeRef.current = time;
      setCurrentTime(time);
    }
  };
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write audio data
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
