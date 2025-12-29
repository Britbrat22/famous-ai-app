import React, { useState } from 'react';
import { X, Download, FileAudio, Music, Loader2, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, quality: string, mastered: boolean) => Promise<void>;
  projectName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  projectName,
}) => {
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav');
  const [quality, setQuality] = useState('high');
  const [mastered, setMastered] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format, quality, mastered);
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d2d2d] rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-lg font-semibold text-white">Export Project</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Project Name</label>
            <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-3">
              <Music className="w-4 h-4 text-[#b24bf3]" />
              <span className="text-white font-medium">{projectName}</span>
            </div>
          </div>

          {/* Format selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('wav')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === 'wav'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                    : 'border-[#3a3a3a] hover:border-[#4a4a4a]'
                }`}
              >
                <FileAudio className={`w-6 h-6 mb-2 ${format === 'wav' ? 'text-[#00d4ff]' : 'text-gray-400'}`} />
                <div className={`font-medium ${format === 'wav' ? 'text-white' : 'text-gray-300'}`}>WAV</div>
                <div className="text-xs text-gray-500">Lossless quality</div>
              </button>
              <button
                onClick={() => setFormat('mp3')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === 'mp3'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                    : 'border-[#3a3a3a] hover:border-[#4a4a4a]'
                }`}
              >
                <FileAudio className={`w-6 h-6 mb-2 ${format === 'mp3' ? 'text-[#00d4ff]' : 'text-gray-400'}`} />
                <div className={`font-medium ${format === 'mp3' ? 'text-white' : 'text-gray-300'}`}>MP3</div>
                <div className="text-xs text-gray-500">Smaller file size</div>
              </button>
            </div>
          </div>

          {/* Quality selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Quality</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    quality === q
                      ? 'bg-[#00d4ff] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Mastered toggle */}
          <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4">
            <div>
              <div className="text-white font-medium">Apply Mastering</div>
              <div className="text-xs text-gray-500">Export with AI mastering applied</div>
            </div>
            <button
              onClick={() => setMastered(!mastered)}
              className={`w-12 h-6 rounded-full transition-all ${
                mastered ? 'bg-[#b24bf3]' : 'bg-[#3a3a3a]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  mastered ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a3a3a] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#3a3a3a] text-white font-medium hover:bg-[#4a4a4a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-medium hover:from-[#00e5ff] hover:to-[#00aadd] transition-all flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : exportComplete ? (
              <>
                <Check className="w-4 h-4" />
                Done!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
