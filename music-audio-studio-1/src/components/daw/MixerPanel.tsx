import React from 'react';
import { Track } from '@/types/daw';
import { Volume2, VolumeX } from 'lucide-react';

interface MixerPanelProps {
  tracks: Track[];
  masterVolume: number;
  analyserData: Uint8Array;
  onTrackVolumeChange: (trackId: string, volume: number) => void;
  onTrackPanChange: (trackId: string, pan: number) => void;
  onTrackMuteToggle: (trackId: string) => void;
  onTrackSoloToggle: (trackId: string) => void;
  onMasterVolumeChange: (volume: number) => void;
}

export const MixerPanel: React.FC<MixerPanelProps> = ({
  tracks,
  masterVolume,
  analyserData,
  onTrackVolumeChange,
  onTrackPanChange,
  onTrackMuteToggle,
  onTrackSoloToggle,
  onMasterVolumeChange,
}) => {
  const hasSolo = tracks.some(t => t.solo);

  const getMeterLevel = (index: number): number => {
    if (analyserData.length === 0) return 0;
    const dataIndex = Math.floor((index / tracks.length) * analyserData.length);
    return analyserData[dataIndex] / 255;
  };

  return (
    <div className="h-48 bg-[#1e1e1e] border-t border-[#3a3a3a] flex overflow-x-auto">
      {/* Track channels */}
      {tracks.map((track, index) => {
        const effectiveMuted = track.muted || (hasSolo && !track.solo);
        const meterLevel = effectiveMuted ? 0 : getMeterLevel(index);

        return (
          <div
            key={track.id}
            className="flex-shrink-0 w-20 border-r border-[#3a3a3a] flex flex-col"
          >
            {/* Track name */}
            <div
              className="h-6 px-2 flex items-center justify-center text-xs font-medium truncate"
              style={{ backgroundColor: `${track.color}33`, color: track.color }}
            >
              {track.name}
            </div>

            {/* Fader area */}
            <div className="flex-1 flex items-center justify-center gap-2 px-2 py-2">
              {/* Meter */}
              <div className="w-3 h-full bg-[#1a1a1a] rounded-full overflow-hidden flex flex-col-reverse">
                <div
                  className="w-full transition-all duration-75"
                  style={{
                    height: `${meterLevel * 100}%`,
                    background: `linear-gradient(to top, ${track.color}, ${track.color}88)`,
                  }}
                />
              </div>

              {/* Fader */}
              <div className="relative h-full w-6 flex items-center justify-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => onTrackVolumeChange(track.id, parseFloat(e.target.value))}
                  className="absolute w-full h-24 appearance-none bg-transparent cursor-pointer"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                  }}
                />
                <div
                  className="absolute w-1 bg-[#3a3a3a] rounded-full pointer-events-none"
                  style={{ height: '100%' }}
                />
                <div
                  className="absolute w-6 h-3 bg-[#4a4a4a] rounded pointer-events-none"
                  style={{
                    bottom: `${track.volume * 100}%`,
                    transform: 'translateY(50%)',
                  }}
                />
              </div>
            </div>

            {/* Pan knob */}
            <div className="h-8 flex items-center justify-center">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full bg-[#2d2d2d] border border-[#3a3a3a]" />
                <div
                  className="absolute w-0.5 h-3 bg-white rounded-full left-1/2 -translate-x-1/2 origin-bottom"
                  style={{
                    top: '4px',
                    transform: `translateX(-50%) rotate(${track.pan * 135}deg)`,
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="h-8 flex items-center justify-center gap-1 px-1">
              <button
                onClick={() => onTrackMuteToggle(track.id)}
                className={`w-6 h-5 rounded text-[10px] font-bold ${
                  track.muted
                    ? 'bg-red-500/30 text-red-500'
                    : 'bg-[#2d2d2d] text-gray-500 hover:text-white'
                }`}
              >
                M
              </button>
              <button
                onClick={() => onTrackSoloToggle(track.id)}
                className={`w-6 h-5 rounded text-[10px] font-bold ${
                  track.solo
                    ? 'bg-yellow-500/30 text-yellow-500'
                    : 'bg-[#2d2d2d] text-gray-500 hover:text-white'
                }`}
              >
                S
              </button>
            </div>

            {/* dB readout */}
            <div className="h-5 flex items-center justify-center">
              <span className="text-[10px] text-gray-500 font-mono">
                {track.volume === 0 ? '-∞' : `${Math.round((track.volume - 1) * 12)}dB`}
              </span>
            </div>
          </div>
        );
      })}

      {/* Master channel */}
      <div className="flex-shrink-0 w-24 bg-[#252525] flex flex-col">
        <div className="h-6 px-2 flex items-center justify-center text-xs font-bold text-white bg-[#3a3a3a]">
          MASTER
        </div>

        <div className="flex-1 flex items-center justify-center gap-2 px-2 py-2">
          {/* Stereo meters */}
          <div className="flex gap-1 h-full">
            <div className="w-2 h-full bg-[#1a1a1a] rounded-full overflow-hidden flex flex-col-reverse">
              <div
                className="w-full transition-all duration-75"
                style={{
                  height: `${(analyserData[0] || 0) / 255 * 100}%`,
                  background: 'linear-gradient(to top, #7fff00, #ffd93d, #ff6b6b)',
                }}
              />
            </div>
            <div className="w-2 h-full bg-[#1a1a1a] rounded-full overflow-hidden flex flex-col-reverse">
              <div
                className="w-full transition-all duration-75"
                style={{
                  height: `${(analyserData[1] || 0) / 255 * 100}%`,
                  background: 'linear-gradient(to top, #7fff00, #ffd93d, #ff6b6b)',
                }}
              />
            </div>
          </div>

          {/* Master fader */}
          <div className="relative h-full w-8 flex items-center justify-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
              className="absolute w-full h-24 appearance-none bg-transparent cursor-pointer"
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
              }}
            />
            <div className="absolute w-1 bg-[#4a4a4a] rounded-full pointer-events-none" style={{ height: '100%' }} />
            <div
              className="absolute w-8 h-4 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] rounded pointer-events-none"
              style={{
                bottom: `${masterVolume * 100}%`,
                transform: 'translateY(50%)',
              }}
            />
          </div>
        </div>

        <div className="h-8 flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-gray-400" />
        </div>

        <div className="h-8" />

        <div className="h-5 flex items-center justify-center">
          <span className="text-xs text-[#00d4ff] font-mono font-bold">
            {masterVolume === 0 ? '-∞' : `${Math.round((masterVolume - 1) * 12)}dB`}
          </span>
        </div>
      </div>
    </div>
  );
};
