import React, { useState, useRef } from 'react';
import { AudioClip } from '@/types/daw';
import { Waveform, generateFakeWaveform } from './Waveform';
import { GripVertical, Scissors, Copy, Trash2 } from 'lucide-react';

interface AudioClipComponentProps {
  clip: AudioClip;
  trackColor: string;
  pixelsPerSecond: number;
  trackHeight: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (newStartTime: number) => void;
  onResize: (newDuration: number, fromStart: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSplit: (splitTime: number) => void;
}

export const AudioClipComponent: React.FC<AudioClipComponentProps> = ({
  clip,
  trackColor,
  pixelsPerSecond,
  trackHeight,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  onDuplicate,
  onSplit,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const clipRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, startTime: 0 });

  const width = clip.duration * pixelsPerSecond;
  const left = clip.startTime * pixelsPerSecond;

  const waveformData = clip.waveformData || generateFakeWaveform(Math.max(50, Math.floor(width / 3)));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      startTime: clip.startTime,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaTime = deltaX / pixelsPerSecond;
      const newStartTime = Math.max(0, dragStartRef.current.startTime + deltaTime);
      onMove(newStartTime);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(side);
    
    const startX = e.clientX;
    const startDuration = clip.duration;
    const startStartTime = clip.startTime;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaTime = deltaX / pixelsPerSecond;

      if (side === 'right') {
        const newDuration = Math.max(0.1, startDuration + deltaTime);
        onResize(newDuration, false);
      } else {
        const newDuration = Math.max(0.1, startDuration - deltaTime);
        onResize(newDuration, true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
    setShowContextMenu(true);
  };

  return (
    <>
      <div
        ref={clipRef}
        className={`absolute top-1 bottom-1 rounded-lg overflow-hidden cursor-move transition-shadow ${
          isSelected ? 'ring-2 ring-white shadow-lg' : ''
        } ${isDragging ? 'opacity-75' : ''}`}
        style={{
          left: `${left}px`,
          width: `${width}px`,
          backgroundColor: `${trackColor}33`,
          borderLeft: `3px solid ${trackColor}`,
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      >
        {/* Clip header */}
        <div
          className="h-5 px-2 flex items-center gap-1 text-xs font-medium truncate"
          style={{ backgroundColor: `${trackColor}66`, color: 'white' }}
        >
          <GripVertical className="w-3 h-3 opacity-50" />
          <span className="truncate">{clip.name}</span>
        </div>

        {/* Waveform */}
        <div className="absolute inset-0 top-5 flex items-center justify-center overflow-hidden">
          <Waveform
            data={waveformData}
            color={trackColor}
            width={width - 4}
            height={trackHeight - 28}
          />
        </div>

        {/* Resize handles */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20"
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20"
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        />
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="absolute z-50 bg-[#2d2d2d] rounded-lg shadow-xl border border-[#3a3a3a] py-1 min-w-[160px]"
            style={{ left: `${left + width / 2}px`, top: '50%' }}
          >
            <button
              onClick={() => {
                onDuplicate();
                setShowContextMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={() => {
                onSplit(clip.startTime + clip.duration / 2);
                setShowContextMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              Split
            </button>
            <div className="border-t border-[#3a3a3a] my-1" />
            <button
              onClick={() => {
                onDelete();
                setShowContextMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[#3a3a3a] flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
};
