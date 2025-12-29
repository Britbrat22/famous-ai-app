import { supabase } from './supabase';

export interface AIProcessResult {
  success: boolean;
  action: string;
  message?: string;
  data?: Record<string, any>;
  error?: string;
}

export async function cleanVocals(audioUrl?: string): Promise<AIProcessResult> {
  const { data, error } = await supabase.functions.invoke('ai-audio-process', {
    body: { action: 'clean_vocals', audioUrl },
  });

  if (error) {
    return { success: false, action: 'clean_vocals', error: error.message };
  }

  return data as AIProcessResult;
}

export async function isolateVocals(audioUrl?: string): Promise<AIProcessResult> {
  const { data, error } = await supabase.functions.invoke('ai-audio-process', {
    body: { action: 'isolate_vocals', audioUrl },
  });

  if (error) {
    return { success: false, action: 'isolate_vocals', error: error.message };
  }

  return data as AIProcessResult;
}

export async function generateBeat(
  genre: string,
  bpm?: number,
  key?: string
): Promise<AIProcessResult> {
  const { data, error } = await supabase.functions.invoke('ai-audio-process', {
    body: { action: 'generate_beat', genre, bpm, key },
  });

  if (error) {
    return { success: false, action: 'generate_beat', error: error.message };
  }

  return data as AIProcessResult;
}

export async function autoMix(): Promise<AIProcessResult> {
  const { data, error } = await supabase.functions.invoke('ai-audio-process', {
    body: { action: 'auto_mix' },
  });

  if (error) {
    return { success: false, action: 'auto_mix', error: error.message };
  }

  return data as AIProcessResult;
}

export async function masterTrack(preset: string): Promise<AIProcessResult> {
  const { data, error } = await supabase.functions.invoke('ai-audio-process', {
    body: { action: 'master', preset },
  });

  if (error) {
    return { success: false, action: 'master', error: error.message };
  }

  return data as AIProcessResult;
}

export async function analyzeAudio(audioUrl: string): Promise<{
  bpm: number;
  key: string;
  mood: string;
  duration: number;
}> {
  // This would call a real audio analysis API
  // For now, return simulated results
  return {
    bpm: Math.floor(80 + Math.random() * 80), // 80-160 BPM
    key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)] + 
         (Math.random() > 0.5 ? ' major' : ' minor'),
    mood: ['energetic', 'melancholic', 'uplifting', 'dark', 'chill'][Math.floor(Math.random() * 5)],
    duration: 180,
  };
}
