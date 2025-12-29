import React from 'react';
import { Volume2, VolumeX, Headphones, Mic } from 'lucide-react';
import { Track } from '@/types/daw';

interface TrackHeaderProps {
  track: Track;
  isSelected: boolean;
  hasSolo: boolean;
  onSelect: () => void;
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
  onArmToggle: () => void;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

const TRACK_COLORS = [
  '#00d4ff', '#7fff00', '#b24bf3', '#ff6b6b', '#ffd93d',
  '#6bcb77', '#4d96ff', '#ff922b', '#845ef7', '#20c997'
];

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  track,
  isSelected,
  hasSolo,
  onSelect,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
  onSoloToggle,
  onArmToggle,
  onNameChange,
  onColorChange,
}) => {
  const effectiveMuted = track.muted || (hasSolo && !track.solo);

  return (
    <div
      className={`h-24 bg-[#2d2d2d] border-b border-[#3a3a3a] p-2 cursor-pointer transition-colors ${
        isSelected ? 'bg-[#3a3a3a]' : ''
      }`}
      onClick={onSelect}
    >
      {/* Track name and color */}
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <div
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{ backgroundColor: track.color }}
          />
          <input
            type="color"
            value={track.color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={track.name}
          onChange={(e) => onNameChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none focus:bg-[#1a1a1a] rounded px-1"
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-1 mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMuteToggle();
          }}
          className={`w-7 h-6 rounded text-xs font-bold transition-colors ${
            track.muted
              ? 'bg-red-500/20 text-red-500'
              : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
          }`}
        >
          M
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSoloToggle();
          }}
          className={`w-7 h-6 rounded text-xs font-bold transition-colors ${
            track.solo
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
          }`}
        >
          S
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onArmToggle();
          }}
          className={`w-7 h-6 rounded flex items-center justify-center transition-colors ${
            track.armed
              ? 'bg-red-500 text-white'
              : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
          }`}
        >
          <Mic className="w-3 h-3" />
        </button>
      </div>

      {/* Volume and Pan */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 flex-1">
          {effectiveMuted ? (
            <VolumeX className="w-3 h-3 text-gray-500" />
          ) : (
            <Volume2 className="w-3 h-3 text-gray-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
            style={{
              background: `linear-gradient(to right, ${track.color} ${track.volume * 100}%, #1a1a1a ${track.volume * 100}%)`
            }}
          />
        </div>
        <div className="w-12 text-right">
          <span className="text-[10px] text-gray-500 font-mono">
            {track.volume === 0 ? '-∞' : `${Math.round((track.volume - 1) * 12)}dB`}
          </span>
        </div>
      </div>
    </div>
  );
};
