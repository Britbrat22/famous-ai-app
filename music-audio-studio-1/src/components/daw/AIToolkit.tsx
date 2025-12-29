import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Music,
  Mic2,
  Sliders,
  Volume2,
  Radio,
  Zap,
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  Play,
} from 'lucide-react';

interface AIToolkitProps {
  isOpen: boolean;
  onToggle: () => void;
  onCleanVocals: () => void;
  onIsolateVocals: () => void;
  onGenerateBeat: (genre: string) => void;
  onAutoMix: () => void;
  onMaster: (preset: string) => void;
  isProcessing: boolean;
}

const GENRES = [
  { id: 'trap', name: 'Trap', color: '#ff6b6b' },
  { id: 'lofi', name: 'Lo-Fi', color: '#845ef7' },
  { id: 'pop', name: 'Pop', color: '#ffd93d' },
  { id: 'rnb', name: 'R&B', color: '#20c997' },
  { id: 'hiphop', name: 'Hip-Hop', color: '#ff922b' },
  { id: 'edm', name: 'EDM', color: '#00d4ff' },
  { id: 'rock', name: 'Rock', color: '#6bcb77' },
  { id: 'jazz', name: 'Jazz', color: '#b24bf3' },
];

const MASTER_PRESETS = [
  { id: 'spotify', name: 'Spotify Ready', loudness: '-14 LUFS' },
  { id: 'apple', name: 'Apple Music', loudness: '-16 LUFS' },
  { id: 'youtube', name: 'YouTube', loudness: '-14 LUFS' },
  { id: 'club', name: 'Club/DJ', loudness: '-8 LUFS' },
  { id: 'broadcast', name: 'Broadcast', loudness: '-24 LUFS' },
];

export const AIToolkit: React.FC<AIToolkitProps> = ({
  isOpen,
  onToggle,
  onCleanVocals,
  onIsolateVocals,
  onGenerateBeat,
  onAutoMix,
  onMaster,
  isProcessing,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('vocal');
  const [selectedGenre, setSelectedGenre] = useState('trap');
  const [selectedPreset, setSelectedPreset] = useState('spotify');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#b24bf3] text-white px-2 py-4 rounded-l-lg shadow-lg hover:bg-[#9b3dd3] transition-colors z-20"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-72 bg-[#252525] border-l border-[#3a3a3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#3a3a3a]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#b24bf3]" />
          <span className="font-semibold text-white">AI Toolkit</span>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2d2d2d] rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#b24bf3] animate-spin" />
            <span className="text-white font-medium">AI Processing...</span>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Vocal Processing */}
        <div className="border-b border-[#3a3a3a]">
          <button
            onClick={() => toggleSection('vocal')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2d2d2d] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-[#7fff00]" />
              <span className="text-white font-medium">Vocal Processing</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSection === 'vocal' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'vocal' && (
            <div className="px-4 pb-4 space-y-3">
              <button
                onClick={onCleanVocals}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#7fff00]/20 to-[#7fff00]/10 border border-[#7fff00]/30 rounded-lg p-3 text-left hover:border-[#7fff00]/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="w-4 h-4 text-[#7fff00]" />
                  <span className="text-white font-medium">Clean Vocals</span>
                </div>
                <p className="text-xs text-gray-400">
                  Remove noise, de-ess, level volume, enhance clarity
                </p>
              </button>

              <button
                onClick={onIsolateVocals}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#00d4ff]/20 to-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg p-3 text-left hover:border-[#00d4ff]/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="w-4 h-4 text-[#00d4ff]" />
                  <span className="text-white font-medium">Isolate Vocals</span>
                </div>
                <p className="text-xs text-gray-400">
                  Separate vocals from instrumental using AI
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Beat Generation */}
        <div className="border-b border-[#3a3a3a]">
          <button
            onClick={() => toggleSection('beat')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2d2d2d] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#b24bf3]" />
              <span className="text-white font-medium">AI Beat Generator</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSection === 'beat' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'beat' && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-gray-400">
                Generate a beat that matches your vocals' tempo, key, and mood
              </p>

              <div className="grid grid-cols-4 gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedGenre === genre.id
                        ? 'ring-2 ring-offset-1 ring-offset-[#252525]'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: `${genre.color}20`,
                      color: genre.color,
                      ringColor: selectedGenre === genre.id ? genre.color : 'transparent',
                    }}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onGenerateBeat(selectedGenre)}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#b24bf3] to-[#8b3cc7] text-white rounded-lg py-3 font-medium hover:from-[#c25fff] hover:to-[#9b4cd7] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Generate Beat
              </button>
            </div>
          )}
        </div>

        {/* Smart Mixing */}
        <div className="border-b border-[#3a3a3a]">
          <button
            onClick={() => toggleSection('mix')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2d2d2d] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ffd93d]" />
              <span className="text-white font-medium">Smart Mixing</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSection === 'mix' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'mix' && (
            <div className="px-4 pb-4 space-y-3">
              <button
                onClick={onAutoMix}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#ffd93d]/20 to-[#ffd93d]/10 border border-[#ffd93d]/30 rounded-lg p-3 text-left hover:border-[#ffd93d]/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-[#ffd93d]" />
                  <span className="text-white font-medium">Auto Mix</span>
                </div>
                <p className="text-xs text-gray-400">
                  Balance levels, EQ conflicts, stereo width
                </p>
              </button>

              <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Level Balance</span>
                  <span className="text-[#7fff00]">Optimized</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">EQ Conflicts</span>
                  <span className="text-yellow-500">2 Found</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Stereo Width</span>
                  <span className="text-[#00d4ff]">Wide</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mastering */}
        <div className="border-b border-[#3a3a3a]">
          <button
            onClick={() => toggleSection('master')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2d2d2d] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#ff6b6b]" />
              <span className="text-white font-medium">AI Mastering</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSection === 'master' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'master' && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-gray-400">
                One-click mastering for streaming platforms
              </p>

              <div className="space-y-2">
                {MASTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-[#ff6b6b]/20 border border-[#ff6b6b]/50'
                        : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedPreset === preset.id && (
                        <Check className="w-4 h-4 text-[#ff6b6b]" />
                      )}
                      <span className="text-white text-sm">{preset.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {preset.loudness}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-[#2d2d2d] text-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-[#3a3a3a] transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => onMaster(selectedPreset)}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-[#ff6b6b] to-[#ee5a5a] text-white rounded-lg py-2 text-sm font-medium hover:from-[#ff7b7b] hover:to-[#ff6a6a] transition-all"
                >
                  Master
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#3a3a3a] bg-[#1e1e1e]">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3 text-[#b24bf3]" />
          <span>Powered by AI</span>
        </div>
      </div>
    </div>
  );
};
