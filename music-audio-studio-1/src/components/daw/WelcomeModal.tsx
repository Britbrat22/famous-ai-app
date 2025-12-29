import React, { useState } from 'react';
import { X, Upload, Mic, Music, Sparkles, ArrowRight, FolderOpen } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: File[]) => void;
  onStartRecording: () => void;
  onGenerateBeat: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onFilesSelected,
  onStartRecording,
  onGenerateBeat,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'generate'>('upload');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#b24bf3]/20 to-[#00d4ff]/20 border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b24bf3] to-[#00d4ff] flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome to StudioAI</h2>
              <p className="text-gray-400">Let's create something amazing</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3a]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4 inline-block mr-2" />
            Upload Audio
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'record'
                ? 'text-[#7fff00] border-b-2 border-[#7fff00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 inline-block mr-2" />
            Record Vocals
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'text-[#b24bf3] border-b-2 border-[#b24bf3]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            AI Generate
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' && (
            <div>
              <FileUploadZone
                onFilesSelected={(files) => {
                  onFilesSelected(files);
                  onClose();
                }}
              />
              <p className="text-center text-gray-500 text-sm mt-4">
                Drag and drop your audio files or click to browse
              </p>
            </div>
          )}

          {activeTab === 'record' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7fff00]/20 to-[#7fff00]/10 flex items-center justify-center">
                <Mic className="w-12 h-12 text-[#7fff00]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Record Vocals
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Record directly in your browser using your microphone. 
                We'll add it to your project automatically.
              </p>
              <button
                onClick={() => {
                  onStartRecording();
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7fff00] text-black font-semibold hover:bg-[#8fff10] transition-colors"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#b24bf3]/20 to-[#b24bf3]/10 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#b24bf3]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Beat Generator
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Let AI create a beat for you. Choose a genre and we'll generate 
                a professional instrumental track.
              </p>
              <button
                onClick={() => {
                  onGenerateBeat();
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#b24bf3] to-[#00d4ff] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-5 h-5" />
                Generate Beat
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a3a3a] bg-[#1a1a1a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Skip for now
          </button>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FolderOpen className="w-4 h-4" />
            Or open an existing project
          </div>
        </div>
      </div>
    </div>
  );
};
