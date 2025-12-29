import React from 'react';
import { Track, Effect } from '@/types/daw';
import { EQPanel } from './EQPanel';
import { EffectsRack } from './EffectsRack';
import { X, Volume2, Settings } from 'lucide-react';

interface TrackDetailsPanelProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackUpdate: (updates: Partial<Track>) => void;
}

export const TrackDetailsPanel: React.FC<TrackDetailsPanelProps> = ({
  track,
  isOpen,
  onClose,
  onTrackUpdate,
}) => {
  if (!isOpen || !track) return null;

  const handleEffectAdd = (type: Effect['type']) => {
    const newEffect: Effect = {
      id: crypto.randomUUID(),
      type,
      enabled: true,
      params: {},
    };
    onTrackUpdate({ effects: [...track.effects, newEffect] });
  };

  const handleEffectRemove = (effectId: string) => {
    onTrackUpdate({
      effects: track.effects.filter((e) => e.id !== effectId),
    });
  };

  const handleEffectToggle = (effectId: string) => {
    onTrackUpdate({
      effects: track.effects.map((e) =>
        e.id === effectId ? { ...e, enabled: !e.enabled } : e
      ),
    });
  };

  const handleEffectParamChange = (effectId: string, param: string, value: number) => {
    onTrackUpdate({
      effects: track.effects.map((e) =>
        e.id === effectId ? { ...e, params: { ...e.params, [param]: value } } : e
      ),
    });
  };

  return (
    <div className="w-72 bg-[#252525] border-l border-[#3a3a3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#3a3a3a]">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: track.color }}
          />
          <span className="font-medium text-white truncate">{track.name}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Volume & Pan */}
        <div className="bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] p-3">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Volume & Pan</span>
          </div>

          {/* Volume */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Volume</span>
              <span className="text-xs text-gray-500 font-mono">
                {track.volume === 0 ? '-∞' : `${Math.round((track.volume - 1) * 12)}dB`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.volume}
              onChange={(e) => onTrackUpdate({ volume: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${track.color} ${track.volume * 100}%, #2d2d2d ${track.volume * 100}%)`,
              }}
            />
          </div>

          {/* Pan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Pan</span>
              <span className="text-xs text-gray-500 font-mono">
                {track.pan === 0 ? 'C' : track.pan < 0 ? `L${Math.abs(Math.round(track.pan * 100))}` : `R${Math.round(track.pan * 100)}`}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={track.pan}
                onChange={(e) => onTrackUpdate({ pan: parseFloat(e.target.value) })}
                className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer"
              />
              <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-[#3a3a3a] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-600">L</span>
              <span className="text-[10px] text-gray-600">R</span>
            </div>
          </div>
        </div>

        {/* EQ */}
        <EQPanel
          eq={track.eq}
          onChange={(eq) => onTrackUpdate({ eq })}
          color={track.color}
        />

        {/* Effects */}
        <EffectsRack
          effects={track.effects}
          onEffectAdd={handleEffectAdd}
          onEffectRemove={handleEffectRemove}
          onEffectToggle={handleEffectToggle}
          onEffectParamChange={handleEffectParamChange}
        />

        {/* Track settings */}
        <div className="bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] p-3">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Settings</span>
          </div>

          {/* Track name */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Track Name</label>
            <input
              type="text"
              value={track.name}
              onChange={(e) => onTrackUpdate({ name: e.target.value })}
              className="w-full bg-[#2d2d2d] rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
            />
          </div>

          {/* Track color */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {[
                '#00d4ff', '#7fff00', '#b24bf3', '#ff6b6b', '#ffd93d',
                '#6bcb77', '#4d96ff', '#ff922b', '#845ef7', '#20c997'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => onTrackUpdate({ color })}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    track.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e] scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
