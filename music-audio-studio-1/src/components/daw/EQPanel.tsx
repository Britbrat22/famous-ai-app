import React from 'react';
import { EQSettings } from '@/types/daw';

interface EQPanelProps {
  eq: EQSettings;
  onChange: (eq: EQSettings) => void;
  color?: string;
}

export const EQPanel: React.FC<EQPanelProps> = ({
  eq,
  onChange,
  color = '#00d4ff',
}) => {
  const bands = [
    { key: 'low', label: 'Low', freq: '100Hz' },
    { key: 'mid', label: 'Mid', freq: '1kHz' },
    { key: 'high', label: 'High', freq: '10kHz' },
  ] as const;

  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">EQ</span>
        <button
          onClick={() => onChange({ low: 0, mid: 0, high: 0 })}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 h-32">
        {bands.map((band) => {
          const value = eq[band.key];
          const percentage = ((value + 12) / 24) * 100;

          return (
            <div key={band.key} className="flex-1 flex flex-col items-center gap-2">
              {/* Value display */}
              <span className="text-xs font-mono text-gray-400">
                {value > 0 ? '+' : ''}{value}dB
              </span>

              {/* Slider container */}
              <div className="relative h-20 w-full flex items-center justify-center">
                {/* Track background */}
                <div className="absolute h-full w-1 bg-[#2d2d2d] rounded-full" />

                {/* Active track */}
                <div
                  className="absolute w-1 rounded-full transition-all"
                  style={{
                    backgroundColor: color,
                    height: `${Math.abs(value) / 12 * 50}%`,
                    bottom: value >= 0 ? '50%' : 'auto',
                    top: value < 0 ? '50%' : 'auto',
                  }}
                />

                {/* Center line */}
                <div className="absolute w-3 h-0.5 bg-[#3a3a3a] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Slider input */}
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={value}
                  onChange={(e) =>
                    onChange({ ...eq, [band.key]: parseFloat(e.target.value) })
                  }
                  className="absolute w-full h-20 opacity-0 cursor-pointer"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                  }}
                />

                {/* Thumb indicator */}
                <div
                  className="absolute w-4 h-2 rounded-sm transition-all pointer-events-none"
                  style={{
                    backgroundColor: color,
                    bottom: `${percentage}%`,
                    transform: 'translateY(50%)',
                  }}
                />
              </div>

              {/* Label */}
              <div className="text-center">
                <div className="text-xs font-medium text-white">{band.label}</div>
                <div className="text-[10px] text-gray-500">{band.freq}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EQ curve visualization */}
      <div className="mt-3 h-12 bg-[#1a1a1a] rounded overflow-hidden relative">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#2a2a2a" strokeWidth="0.5" />
          <line x1="33" y1="0" x2="33" y2="40" stroke="#2a2a2a" strokeWidth="0.5" />
          <line x1="66" y1="0" x2="66" y2="40" stroke="#2a2a2a" strokeWidth="0.5" />

          {/* EQ curve */}
          <path
            d={`M 0 ${20 - eq.low * 1.5} 
                Q 16 ${20 - eq.low * 1.5}, 33 ${20 - (eq.low + eq.mid) / 2 * 1.5}
                Q 50 ${20 - eq.mid * 1.5}, 66 ${20 - (eq.mid + eq.high) / 2 * 1.5}
                Q 83 ${20 - eq.high * 1.5}, 100 ${20 - eq.high * 1.5}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Fill under curve */}
          <path
            d={`M 0 ${20 - eq.low * 1.5} 
                Q 16 ${20 - eq.low * 1.5}, 33 ${20 - (eq.low + eq.mid) / 2 * 1.5}
                Q 50 ${20 - eq.mid * 1.5}, 66 ${20 - (eq.mid + eq.high) / 2 * 1.5}
                Q 83 ${20 - eq.high * 1.5}, 100 ${20 - eq.high * 1.5}
                L 100 40 L 0 40 Z`}
            fill={color}
            opacity="0.1"
          />
        </svg>
      </div>
    </div>
  );
};
