import React from 'react';
import { Play, Pause, Square, Circle, SkipBack, SkipForward, Repeat, Mic } from 'lucide-react';

interface TransportControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  bpm: number;
  loopEnabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRecord: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleLoop: () => void;
  onBpmChange: (bpm: number) => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  isRecording,
  currentTime,
  bpm,
  loopEnabled,
  onPlay,
  onPause,
  onStop,
  onRecord,
  onSkipBack,
  onSkipForward,
  onToggleLoop,
  onBpmChange,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatBars = (seconds: number): string => {
    const beatsPerSecond = bpm / 60;
    const totalBeats = seconds * beatsPerSecond;
    const bars = Math.floor(totalBeats / 4) + 1;
    const beats = Math.floor(totalBeats % 4) + 1;
    return `${bars}.${beats}`;
  };

  return (
    <div className="h-16 bg-[#252525] border-b border-[#3a3a3a] flex items-center justify-between px-4">
      {/* Left section - Time display */}
      <div className="flex items-center gap-4">
        <div className="bg-[#1a1a1a] rounded-lg px-4 py-2 font-mono">
          <div className="text-[#00d4ff] text-xl font-bold tracking-wider">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-500 text-xs">
            Bar {formatBars(currentTime)}
          </div>
        </div>
      </div>

      {/* Center section - Transport buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSkipBack}
          className="w-10 h-10 rounded-lg bg-[#2d2d2d] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
        >
          <SkipBack className="w-5 h-5 text-gray-300" />
        </button>

        <button
          onClick={onStop}
          className="w-10 h-10 rounded-lg bg-[#2d2d2d] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
        >
          <Square className="w-5 h-5 text-gray-300" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099cc] hover:from-[#00e5ff] hover:to-[#00aadd] flex items-center justify-center transition-all shadow-lg shadow-[#00d4ff]/20"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white" />
          ) : (
            <Play className="w-7 h-7 text-white ml-1" />
          )}
        </button>

        <button
          onClick={onRecord}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-[#2d2d2d] hover:bg-red-500/20'
          }`}
        >
          <Circle className={`w-6 h-6 ${isRecording ? 'text-white fill-white' : 'text-red-500'}`} />
        </button>

        <button
          onClick={onSkipForward}
          className="w-10 h-10 rounded-lg bg-[#2d2d2d] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
        >
          <SkipForward className="w-5 h-5 text-gray-300" />
        </button>

        <button
          onClick={onToggleLoop}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            loopEnabled
              ? 'bg-[#b24bf3]/20 text-[#b24bf3]'
              : 'bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300'
          }`}
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Right section - BPM and settings */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-3 py-2">
          <span className="text-gray-400 text-sm">BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onBpmChange(parseInt(e.target.value) || 120)}
            className="w-16 bg-transparent text-[#7fff00] font-mono text-lg font-bold text-center focus:outline-none"
            min={20}
            max={300}
          />
        </div>

        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-3 py-2">
          <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
          <span className="text-gray-400 text-sm">4/4</span>
        </div>
      </div>
    </div>
  );
};
