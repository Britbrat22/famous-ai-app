import React, { useRef, useState, useCallback } from 'react';
import { Track, AudioClip } from '@/types/daw';
import { TrackHeader } from './TrackHeader';
import { AudioClipComponent } from './AudioClipComponent';
import { Plus, ZoomIn, ZoomOut, Magnet, MousePointer, Scissors } from 'lucide-react';

interface TimelineProps {
  tracks: Track[];
  currentTime: number;
  duration: number;
  zoom: number;
  bpm: number;
  snapEnabled: boolean;
  selectedTrackId: string | null;
  selectedClipId: string | null;
  tool: 'select' | 'cut' | 'draw';
  onTrackSelect: (trackId: string) => void;
  onClipSelect: (clipId: string) => void;
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void;
  onClipUpdate: (trackId: string, clipId: string, updates: Partial<AudioClip>) => void;
  onClipDelete: (trackId: string, clipId: string) => void;
  onClipDuplicate: (trackId: string, clipId: string) => void;
  onClipSplit: (trackId: string, clipId: string, splitTime: number) => void;
  onAddTrack: () => void;
  onZoomChange: (zoom: number) => void;
  onSnapToggle: () => void;
  onToolChange: (tool: 'select' | 'cut' | 'draw') => void;
  onSeek: (time: number) => void;
  onDropAudio: (trackId: string, file: File, startTime: number) => void;
}

const TRACK_HEIGHT = 96;
const HEADER_WIDTH = 200;

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  currentTime,
  duration,
  zoom,
  bpm,
  snapEnabled,
  selectedTrackId,
  selectedClipId,
  tool,
  onTrackSelect,
  onClipSelect,
  onTrackUpdate,
  onClipUpdate,
  onClipDelete,
  onClipDuplicate,
  onClipSplit,
  onAddTrack,
  onZoomChange,
  onSnapToggle,
  onToolChange,
  onSeek,
  onDropAudio,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [dragOverTrack, setDragOverTrack] = useState<string | null>(null);

  const pixelsPerSecond = zoom;
  const timelineWidth = Math.max(duration * pixelsPerSecond, 2000);
  const beatsPerSecond = bpm / 60;
  const pixelsPerBeat = pixelsPerSecond / beatsPerSecond;
  const pixelsPerBar = pixelsPerBeat * 4;

  const hasSolo = tracks.some(t => t.solo);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollX;
    const time = x / pixelsPerSecond;
    onSeek(Math.max(0, time));
  };

  const handleDragOver = (e: React.DragEvent, trackId: string) => {
    e.preventDefault();
    setDragOverTrack(trackId);
  };

  const handleDragLeave = () => {
    setDragOverTrack(null);
  };

  const handleDrop = (e: React.DragEvent, trackId: string) => {
    e.preventDefault();
    setDragOverTrack(null);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f => 
      f.type.startsWith('audio/') || 
      f.name.match(/\.(wav|mp3|aac|flac|ogg|m4a)$/i)
    );

    if (audioFile && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + scrollX;
      const startTime = Math.max(0, x / pixelsPerSecond);
      onDropAudio(trackId, audioFile, startTime);
    }
  };

  const renderTimeRuler = () => {
    const markers = [];
    const totalBars = Math.ceil(duration * beatsPerSecond / 4) + 10;

    for (let bar = 0; bar <= totalBars; bar++) {
      const x = bar * pixelsPerBar;
      markers.push(
        <div
          key={`bar-${bar}`}
          className="absolute top-0 bottom-0 border-l border-[#3a3a3a]"
          style={{ left: `${x}px` }}
        >
          <span className="absolute top-1 left-1 text-[10px] text-gray-500 font-mono">
            {bar + 1}
          </span>
        </div>
      );

      // Beat markers
      for (let beat = 1; beat < 4; beat++) {
        const beatX = x + beat * pixelsPerBeat;
        markers.push(
          <div
            key={`beat-${bar}-${beat}`}
            className="absolute top-4 bottom-0 border-l border-[#2a2a2a]"
            style={{ left: `${beatX}px` }}
          />
        );
      }
    }

    return markers;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 bg-[#252525] border-b border-[#3a3a3a] flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToolChange('select')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              tool === 'select' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToolChange('cut')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              tool === 'cut' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#3a3a3a] mx-1" />
          <button
            onClick={onSnapToggle}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              snapEnabled ? 'bg-[#b24bf3]/20 text-[#b24bf3]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Magnet className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onZoomChange(Math.max(20, zoom - 20))}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-24 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00d4ff]"
              style={{ width: `${((zoom - 20) / 180) * 100}%` }}
            />
          </div>
          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 20))}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track headers */}
        <div className="flex-shrink-0 bg-[#252525] border-r border-[#3a3a3a]" style={{ width: HEADER_WIDTH }}>
          {/* Time ruler header */}
          <div className="h-8 border-b border-[#3a3a3a]" />
          
          {/* Track headers */}
          {tracks.map((track) => (
            <TrackHeader
              key={track.id}
              track={track}
              isSelected={selectedTrackId === track.id}
              hasSolo={hasSolo}
              onSelect={() => onTrackSelect(track.id)}
              onVolumeChange={(volume) => onTrackUpdate(track.id, { volume })}
              onPanChange={(pan) => onTrackUpdate(track.id, { pan })}
              onMuteToggle={() => onTrackUpdate(track.id, { muted: !track.muted })}
              onSoloToggle={() => onTrackUpdate(track.id, { solo: !track.solo })}
              onArmToggle={() => onTrackUpdate(track.id, { armed: !track.armed })}
              onNameChange={(name) => onTrackUpdate(track.id, { name })}
              onColorChange={(color) => onTrackUpdate(track.id, { color })}
            />
          ))}

          {/* Add track button */}
          <button
            onClick={onAddTrack}
            className="w-full h-10 flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Track</span>
          </button>
        </div>

        {/* Timeline area */}
        <div
          ref={timelineRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          onScroll={(e) => setScrollX(e.currentTarget.scrollLeft)}
        >
          <div style={{ width: timelineWidth, minHeight: '100%' }}>
            {/* Time ruler */}
            <div
              className="h-8 bg-[#1e1e1e] border-b border-[#3a3a3a] relative sticky top-0 z-10"
              onClick={handleTimelineClick}
            >
              {renderTimeRuler()}
              
              {/* Playhead in ruler */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#00d4ff] z-20"
                style={{ left: `${currentTime * pixelsPerSecond}px` }}
              >
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00d4ff] rotate-45" />
              </div>
            </div>

            {/* Tracks */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`relative border-b border-[#2a2a2a] ${
                  dragOverTrack === track.id ? 'bg-[#00d4ff]/10' : ''
                }`}
                style={{ height: TRACK_HEIGHT }}
                onDragOver={(e) => handleDragOver(e, track.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, track.id)}
                onClick={handleTimelineClick}
              >
                {/* Grid lines */}
                {renderTimeRuler()}

                {/* Audio clips */}
                {track.clips.map((clip) => (
                  <AudioClipComponent
                    key={clip.id}
                    clip={clip}
                    trackColor={track.color}
                    pixelsPerSecond={pixelsPerSecond}
                    trackHeight={TRACK_HEIGHT}
                    isSelected={selectedClipId === clip.id}
                    onSelect={() => onClipSelect(clip.id)}
                    onMove={(newStartTime) => onClipUpdate(track.id, clip.id, { startTime: newStartTime })}
                    onResize={(newDuration, fromStart) => {
                      if (fromStart) {
                        const delta = clip.duration - newDuration;
                        onClipUpdate(track.id, clip.id, {
                          duration: newDuration,
                          startTime: clip.startTime + delta,
                          offset: clip.offset + delta,
                        });
                      } else {
                        onClipUpdate(track.id, clip.id, { duration: newDuration });
                      }
                    }}
                    onDelete={() => onClipDelete(track.id, clip.id)}
                    onDuplicate={() => onClipDuplicate(track.id, clip.id)}
                    onSplit={(splitTime) => onClipSplit(track.id, clip.id, splitTime)}
                  />
                ))}

                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#00d4ff] z-10 pointer-events-none"
                  style={{ left: `${currentTime * pixelsPerSecond}px` }}
                />

                {/* Drop zone indicator */}
                {dragOverTrack === track.id && (
                  <div className="absolute inset-0 border-2 border-dashed border-[#00d4ff] rounded-lg pointer-events-none flex items-center justify-center">
                    <span className="text-[#00d4ff] text-sm font-medium bg-[#1a1a1a] px-3 py-1 rounded">
                      Drop audio here
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
