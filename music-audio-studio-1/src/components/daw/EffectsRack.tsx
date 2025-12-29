import React, { useState } from 'react';
import { Effect } from '@/types/daw';
import {
  Power,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';

interface EffectsRackProps {
  effects: Effect[];
  onEffectAdd: (type: Effect['type']) => void;
  onEffectRemove: (effectId: string) => void;
  onEffectToggle: (effectId: string) => void;
  onEffectParamChange: (effectId: string, param: string, value: number) => void;
}

const EFFECT_TYPES: { type: Effect['type']; name: string; color: string }[] = [
  { type: 'reverb', name: 'Reverb', color: '#00d4ff' },
  { type: 'delay', name: 'Delay', color: '#b24bf3' },
  { type: 'compressor', name: 'Compressor', color: '#7fff00' },
  { type: 'chorus', name: 'Chorus', color: '#ffd93d' },
  { type: 'distortion', name: 'Distortion', color: '#ff6b6b' },
  { type: 'filter', name: 'Filter', color: '#20c997' },
];

const DEFAULT_PARAMS: Record<Effect['type'], { name: string; min: number; max: number; default: number }[]> = {
  reverb: [
    { name: 'Room Size', min: 0, max: 100, default: 50 },
    { name: 'Damping', min: 0, max: 100, default: 50 },
    { name: 'Mix', min: 0, max: 100, default: 30 },
  ],
  delay: [
    { name: 'Time', min: 0, max: 1000, default: 250 },
    { name: 'Feedback', min: 0, max: 100, default: 40 },
    { name: 'Mix', min: 0, max: 100, default: 30 },
  ],
  compressor: [
    { name: 'Threshold', min: -60, max: 0, default: -20 },
    { name: 'Ratio', min: 1, max: 20, default: 4 },
    { name: 'Attack', min: 0, max: 100, default: 10 },
  ],
  chorus: [
    { name: 'Rate', min: 0, max: 10, default: 2 },
    { name: 'Depth', min: 0, max: 100, default: 50 },
    { name: 'Mix', min: 0, max: 100, default: 50 },
  ],
  distortion: [
    { name: 'Drive', min: 0, max: 100, default: 50 },
    { name: 'Tone', min: 0, max: 100, default: 50 },
    { name: 'Mix', min: 0, max: 100, default: 50 },
  ],
  filter: [
    { name: 'Cutoff', min: 20, max: 20000, default: 1000 },
    { name: 'Resonance', min: 0, max: 100, default: 20 },
    { name: 'Type', min: 0, max: 2, default: 0 },
  ],
};

export const EffectsRack: React.FC<EffectsRackProps> = ({
  effects,
  onEffectAdd,
  onEffectRemove,
  onEffectToggle,
  onEffectParamChange,
}) => {
  const [expandedEffect, setExpandedEffect] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const getEffectInfo = (type: Effect['type']) => {
    return EFFECT_TYPES.find(e => e.type === type) || { name: type, color: '#888' };
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252525] border-b border-[#3a3a3a]">
        <span className="text-sm font-medium text-white">Effects</span>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3a3a] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {showAddMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-[#2d2d2d] rounded-lg shadow-xl border border-[#3a3a3a] py-1 z-50 min-w-[140px]">
                {EFFECT_TYPES.map((effect) => (
                  <button
                    key={effect.type}
                    onClick={() => {
                      onEffectAdd(effect.type);
                      setShowAddMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] flex items-center gap-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: effect.color }}
                    />
                    {effect.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Effects list */}
      <div className="max-h-64 overflow-y-auto">
        {effects.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No effects added
          </div>
        ) : (
          effects.map((effect) => {
            const info = getEffectInfo(effect.type);
            const isExpanded = expandedEffect === effect.id;
            const params = DEFAULT_PARAMS[effect.type];

            return (
              <div
                key={effect.id}
                className="border-b border-[#2a2a2a] last:border-b-0"
              >
                {/* Effect header */}
                <div
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#252525] cursor-pointer"
                  onClick={() => setExpandedEffect(isExpanded ? null : effect.id)}
                >
                  <GripVertical className="w-3 h-3 text-gray-600" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEffectToggle(effect.id);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      effect.enabled
                        ? 'bg-[#7fff00]/20 text-[#7fff00]'
                        : 'bg-[#2d2d2d] text-gray-500'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                  </button>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className={`flex-1 text-sm ${effect.enabled ? 'text-white' : 'text-gray-500'}`}>
                    {info.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEffectRemove(effect.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                {/* Effect parameters */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3">
                    {params.map((param) => (
                      <div key={param.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{param.name}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {effect.params[param.name.toLowerCase().replace(' ', '_')] ?? param.default}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          value={effect.params[param.name.toLowerCase().replace(' ', '_')] ?? param.default}
                          onChange={(e) =>
                            onEffectParamChange(
                              effect.id,
                              param.name.toLowerCase().replace(' ', '_'),
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-1 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${info.color} ${
                              ((effect.params[param.name.toLowerCase().replace(' ', '_')] ?? param.default) - param.min) /
                              (param.max - param.min) * 100
                            }%, #2d2d2d ${
                              ((effect.params[param.name.toLowerCase().replace(' ', '_')] ?? param.default) - param.min) /
                              (param.max - param.min) * 100
                            }%)`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
