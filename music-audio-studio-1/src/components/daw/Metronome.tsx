import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MetronomeProps {
  bpm: number;
  isPlaying: boolean;
  enabled: boolean;
  onToggle: () => void;
}

export const Metronome: React.FC<MetronomeProps> = ({
  bpm,
  isPlaying,
  enabled,
  onToggle,
}) => {
  const [currentBeat, setCurrentBeat] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);

  const scheduleNote = useCallback((time: number, beat: number) => {
    if (!audioContextRef.current || !enabled) return;

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    // Higher pitch for beat 1
    osc.frequency.value = beat === 0 ? 1000 : 800;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.start(time);
    osc.stop(time + 0.1);

    setCurrentBeat(beat);
  }, [enabled]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.1;

    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTimeRef.current, currentBeat);
      nextNoteTimeRef.current += secondsPerBeat;
      setCurrentBeat((prev) => (prev + 1) % 4);
    }

    timerIdRef.current = window.setTimeout(scheduler, 25);
  }, [bpm, currentBeat, scheduleNote]);

  useEffect(() => {
    if (isPlaying && enabled) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduler();
    } else {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
      setCurrentBeat(0);
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [isPlaying, enabled, scheduler]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
          enabled
            ? 'bg-[#ffd93d]/20 text-[#ffd93d]'
            : 'bg-[#2d2d2d] text-gray-400 hover:text-white'
        }`}
      >
        {enabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>

      {/* Beat indicators */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((beat) => (
          <div
            key={beat}
            className={`w-2 h-2 rounded-full transition-all ${
              currentBeat === beat && isPlaying && enabled
                ? beat === 0
                  ? 'bg-[#ffd93d] scale-125'
                  : 'bg-[#00d4ff] scale-110'
                : 'bg-[#3a3a3a]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
