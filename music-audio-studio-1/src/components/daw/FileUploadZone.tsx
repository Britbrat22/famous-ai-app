import React, { useState, useRef, useCallback } from 'react';
import { Upload, Music, FileAudio, X, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  isUploading = false,
  accept = 'audio/*,.wav,.mp3,.aac,.flac,.ogg,.m4a',
  maxSize = 500,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxBytes = maxSize * 1024 * 1024;

    for (const file of files) {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(wav|mp3|aac|flac|ogg|m4a)$/i)) {
        setError(`${file.name} is not a valid audio file`);
        continue;
      }

      if (file.size > maxBytes) {
        setError(`${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }, [maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [validateFiles, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [validateFiles, onFilesSelected]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full p-8 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 group
          ${isDragging
            ? 'border-[#00d4ff] bg-[#00d4ff]/10'
            : 'border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#1a1a1a]'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin" />
          ) : (
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isDragging
                ? 'bg-[#00d4ff]/20 scale-110'
                : 'bg-[#2d2d2d] group-hover:bg-[#3a3a3a]'
              }
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-[#00d4ff]' : 'text-gray-400'}`} />
            </div>
          )}

          <div className="text-center">
            <p className="text-white font-medium mb-1">
              {isUploading ? 'Uploading...' : 'Drop audio files here'}
            </p>
            <p className="text-gray-500 text-sm">
              or click to browse • WAV, MP3, AAC, FLAC up to {maxSize}MB
            </p>
          </div>

          {/* Supported formats */}
          <div className="flex items-center gap-3 mt-2">
            {['WAV', 'MP3', 'AAC', 'FLAC'].map((format) => (
              <div
                key={format}
                className="flex items-center gap-1 px-2 py-1 rounded bg-[#2d2d2d] text-xs text-gray-400"
              >
                <FileAudio className="w-3 h-3" />
                {format}
              </div>
            ))}
          </div>
        </div>

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00d4ff]/5 rounded-2xl">
            <div className="text-[#00d4ff] font-medium flex items-center gap-2">
              <Music className="w-5 h-5" />
              Drop to add to project
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
          <X className="w-4 h-4" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-gray-500 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
