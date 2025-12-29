import React, { useState, useCallback, useEffect } from 'react';
import { Track, AudioClip, Project, DAWState } from '@/types/daw';
import { TransportControls } from './TransportControls';
import { Timeline } from './Timeline';
import { AIToolkit } from './AIToolkit';
import { MixerPanel } from './MixerPanel';
import { ExportModal } from './ExportModal';
import { TrackDetailsPanel } from './TrackDetailsPanel';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { generateFakeWaveform } from './Waveform';
import { supabase } from '@/lib/supabase';
import {
  Save,
  FolderOpen,
  Download,
  Upload,
  Settings,
  Undo,
  Redo,
  Menu,
  X,
  Music,
  HelpCircle,
  Keyboard,
} from 'lucide-react';

const TRACK_COLORS = [
  '#00d4ff', '#7fff00', '#b24bf3', '#ff6b6b', '#ffd93d',
  '#6bcb77', '#4d96ff', '#ff922b', '#845ef7', '#20c997'
];

const createDefaultProject = (): Project => ({
  id: crypto.randomUUID(),
  name: 'Untitled Project',
  bpm: 120,
  timeSignature: '4/4',
  tracks: [
    {
      id: crypto.randomUUID(),
      name: 'Vocals',
      color: TRACK_COLORS[0],
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
      effects: [],
      eq: { low: 0, mid: 0, high: 0 },
    },
    {
      id: crypto.randomUUID(),
      name: 'Beat',
      color: TRACK_COLORS[1],
      volume: 0.7,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
      effects: [],
      eq: { low: 0, mid: 0, high: 0 },
    },
    {
      id: crypto.randomUUID(),
      name: 'Bass',
      color: TRACK_COLORS[2],
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
      effects: [],
      eq: { low: 0, mid: 0, high: 0 },
    },
    {
      id: crypto.randomUUID(),
      name: 'Synth',
      color: TRACK_COLORS[3],
      volume: 0.6,
      pan: 0.3,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
      effects: [],
      eq: { low: 0, mid: 0, high: 0 },
    },
  ],
  duration: 180,
  createdAt: new Date(),
  updatedAt: new Date(),
});

interface DAWInterfaceProps {
  onBack: () => void;
}

export const DAWInterface: React.FC<DAWInterfaceProps> = ({ onBack }) => {
  const [project, setProject] = useState<Project>(createDefaultProject);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(80);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [tool, setTool] = useState<'select' | 'cut' | 'draw'>('select');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [showMixer, setShowMixer] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [history, setHistory] = useState<Project[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const audioEngine = useAudioEngine();

  // Save to history for undo/redo
  const saveToHistory = useCallback((newProject: Project) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newProject]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setProject(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setProject(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Track operations
  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === trackId ? { ...t, ...updates } : t
        ),
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });

    if (updates.volume !== undefined || updates.muted !== undefined) {
      const track = project.tracks.find(t => t.id === trackId);
      if (track) {
        audioEngine.updateTrackVolume(
          trackId,
          updates.volume ?? track.volume,
          updates.muted ?? track.muted
        );
      }
    }

    if (updates.pan !== undefined) {
      audioEngine.updateTrackPan(trackId, updates.pan);
    }
  }, [project.tracks, audioEngine, saveToHistory]);

  const addTrack = useCallback(() => {
    const colorIndex = project.tracks.length % TRACK_COLORS.length;
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: `Track ${project.tracks.length + 1}`,
      color: TRACK_COLORS[colorIndex],
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
      effects: [],
      eq: { low: 0, mid: 0, high: 0 },
    };

    setProject(prev => {
      const newProject = {
        ...prev,
        tracks: [...prev.tracks, newTrack],
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });
  }, [project.tracks.length, saveToHistory]);

  // Clip operations
  const updateClip = useCallback((trackId: string, clipId: string, updates: Partial<AudioClip>) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(t =>
        t.id === trackId
          ? {
              ...t,
              clips: t.clips.map(c =>
                c.id === clipId ? { ...c, ...updates } : c
              ),
            }
          : t
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const deleteClip = useCallback((trackId: string, clipId: string) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === trackId
            ? { ...t, clips: t.clips.filter(c => c.id !== clipId) }
            : t
        ),
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });
    setSelectedClipId(null);
  }, [saveToHistory]);

  const duplicateClip = useCallback((trackId: string, clipId: string) => {
    setProject(prev => {
      const track = prev.tracks.find(t => t.id === trackId);
      const clip = track?.clips.find(c => c.id === clipId);
      if (!clip) return prev;

      const newClip: AudioClip = {
        ...clip,
        id: crypto.randomUUID(),
        startTime: clip.startTime + clip.duration + 0.1,
      };

      const newProject = {
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === trackId
            ? { ...t, clips: [...t.clips, newClip] }
            : t
        ),
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });
  }, [saveToHistory]);

  const splitClip = useCallback((trackId: string, clipId: string, splitTime: number) => {
    setProject(prev => {
      const track = prev.tracks.find(t => t.id === trackId);
      const clip = track?.clips.find(c => c.id === clipId);
      if (!clip) return prev;

      const splitPoint = splitTime - clip.startTime;
      if (splitPoint <= 0 || splitPoint >= clip.duration) return prev;

      const clip1: AudioClip = {
        ...clip,
        duration: splitPoint,
      };

      const clip2: AudioClip = {
        ...clip,
        id: crypto.randomUUID(),
        startTime: splitTime,
        duration: clip.duration - splitPoint,
        offset: clip.offset + splitPoint,
      };

      const newProject = {
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === trackId
            ? {
                ...t,
                clips: [...t.clips.filter(c => c.id !== clipId), clip1, clip2],
              }
            : t
        ),
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });
  }, [saveToHistory]);

  // File handling
  const handleDropAudio = useCallback(async (trackId: string, file: File, startTime: number) => {
    const url = URL.createObjectURL(file);
    const waveformData = await audioEngine.getWaveformData(url);
    const buffer = await audioEngine.loadAudioBuffer(crypto.randomUUID(), url);

    const newClip: AudioClip = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      url,
      startTime: snapEnabled ? Math.round(startTime * 4) / 4 : startTime,
      duration: buffer?.duration || 10,
      offset: 0,
      color: project.tracks.find(t => t.id === trackId)?.color || TRACK_COLORS[0],
      waveformData: waveformData.length > 0 ? waveformData : generateFakeWaveform(200),
    };

    // Load buffer for playback
    await audioEngine.loadAudioBuffer(newClip.id, url);

    setProject(prev => {
      const newProject = {
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === trackId
            ? { ...t, clips: [...t.clips, newClip] }
            : t
        ),
        updatedAt: new Date(),
      };
      saveToHistory(newProject);
      return newProject;
    });
  }, [audioEngine, snapEnabled, project.tracks, saveToHistory]);

  // Transport controls
  const handlePlay = useCallback(() => {
    audioEngine.play(project.tracks, audioEngine.currentTime);
  }, [audioEngine, project.tracks]);

  const handlePause = useCallback(() => {
    audioEngine.pause();
  }, [audioEngine]);

  const handleStop = useCallback(() => {
    audioEngine.stop();
    audioEngine.setCurrentTime(0);
  }, [audioEngine]);

  const handleRecord = useCallback(async () => {
    if (audioEngine.isRecording) {
      const blob = await audioEngine.stopRecording();
      if (blob) {
        const armedTrack = project.tracks.find(t => t.armed);
        if (armedTrack) {
          const file = new File([blob], 'Recording.webm', { type: 'audio/webm' });
          handleDropAudio(armedTrack.id, file, audioEngine.currentTime);
        }
      }
    } else {
      await audioEngine.startRecording();
      handlePlay();
    }
  }, [audioEngine, project.tracks, handleDropAudio, handlePlay]);

  const handleSeek = useCallback((time: number) => {
    const wasPlaying = audioEngine.isPlaying;
    if (wasPlaying) {
      audioEngine.stop();
    }
    audioEngine.setCurrentTime(time);
    if (wasPlaying) {
      audioEngine.play(project.tracks, time);
    }
  }, [audioEngine, project.tracks]);

  // AI features
  const handleCleanVocals = useCallback(async () => {
    setIsAIProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAIProcessing(false);
  }, []);

  const handleIsolateVocals = useCallback(async () => {
    setIsAIProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAIProcessing(false);
  }, []);

  const handleGenerateBeat = useCallback(async (genre: string) => {
    setIsAIProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Add a demo beat clip
    const beatTrack = project.tracks.find(t => t.name.toLowerCase().includes('beat'));
    if (beatTrack) {
      const newClip: AudioClip = {
        id: crypto.randomUUID(),
        name: `AI ${genre} Beat`,
        url: '',
        startTime: 0,
        duration: 30,
        offset: 0,
        color: beatTrack.color,
        waveformData: generateFakeWaveform(200),
      };

      setProject(prev => ({
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === beatTrack.id
            ? { ...t, clips: [...t.clips, newClip] }
            : t
        ),
      }));
    }
    
    setIsAIProcessing(false);
  }, [project.tracks]);

  const handleAutoMix = useCallback(async () => {
    setIsAIProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Auto-adjust volumes
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map((t, i) => ({
        ...t,
        volume: 0.7 + Math.random() * 0.2,
        pan: (i % 2 === 0 ? -1 : 1) * Math.random() * 0.3,
      })),
    }));
    
    setIsAIProcessing(false);
  }, []);

  const handleMaster = useCallback(async (preset: string) => {
    setIsAIProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAIProcessing(false);
  }, []);

  const handleExport = useCallback(async (format: string, quality: string, mastered: boolean) => {
    const duration = Math.max(...project.tracks.flatMap(t => 
      t.clips.map(c => c.startTime + c.duration)
    ), 30);
    
    const blob = await audioEngine.exportMix(project.tracks, duration);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [audioEngine, project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (audioEngine.isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      }

      if (e.code === 'KeyZ' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedClipId && selectedTrackId) {
          deleteClip(selectedTrackId, selectedClipId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioEngine.isPlaying, handlePlay, handlePause, undo, redo, selectedClipId, selectedTrackId, deleteClip]);

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-white overflow-hidden">
      {/* Top bar */}
      <div className="h-12 bg-[#1e1e1e] border-b border-[#3a3a3a] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b24bf3] to-[#00d4ff] flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="bg-transparent text-white font-semibold focus:outline-none focus:bg-[#2d2d2d] rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#3a3a3a] mx-2" />
          <button
            onClick={() => setShowMixer(!showMixer)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              showMixer ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Mixer
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white text-sm font-medium hover:from-[#00e5ff] hover:to-[#00aadd] transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Transport controls */}
      <TransportControls
        isPlaying={audioEngine.isPlaying}
        isRecording={audioEngine.isRecording}
        currentTime={audioEngine.currentTime}
        bpm={project.bpm}
        loopEnabled={loopEnabled}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onRecord={handleRecord}
        onSkipBack={() => handleSeek(0)}
        onSkipForward={() => handleSeek(audioEngine.currentTime + 10)}
        onToggleLoop={() => setLoopEnabled(!loopEnabled)}
        onBpmChange={(bpm) => setProject(prev => ({ ...prev, bpm }))}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Timeline */}
        <Timeline
          tracks={project.tracks}
          currentTime={audioEngine.currentTime}
          duration={project.duration}
          zoom={zoom}
          bpm={project.bpm}
          snapEnabled={snapEnabled}
          selectedTrackId={selectedTrackId}
          selectedClipId={selectedClipId}
          tool={tool}
          onTrackSelect={setSelectedTrackId}
          onClipSelect={setSelectedClipId}
          onTrackUpdate={updateTrack}
          onClipUpdate={updateClip}
          onClipDelete={deleteClip}
          onClipDuplicate={duplicateClip}
          onClipSplit={splitClip}
          onAddTrack={addTrack}
          onZoomChange={setZoom}
          onSnapToggle={() => setSnapEnabled(!snapEnabled)}
          onToolChange={setTool}
          onSeek={handleSeek}
          onDropAudio={handleDropAudio}
        />

        {/* AI Toolkit */}
        <AIToolkit
          isOpen={aiPanelOpen}
          onToggle={() => setAiPanelOpen(!aiPanelOpen)}
          onCleanVocals={handleCleanVocals}
          onIsolateVocals={handleIsolateVocals}
          onGenerateBeat={handleGenerateBeat}
          onAutoMix={handleAutoMix}
          onMaster={handleMaster}
          isProcessing={isAIProcessing}
        />
      </div>

      {/* Mixer panel */}
      {showMixer && (
        <MixerPanel
          tracks={project.tracks}
          masterVolume={masterVolume}
          analyserData={audioEngine.analyserData}
          onTrackVolumeChange={(trackId, volume) => updateTrack(trackId, { volume })}
          onTrackPanChange={(trackId, pan) => updateTrack(trackId, { pan })}
          onTrackMuteToggle={(trackId) => {
            const track = project.tracks.find(t => t.id === trackId);
            if (track) updateTrack(trackId, { muted: !track.muted });
          }}
          onTrackSoloToggle={(trackId) => {
            const track = project.tracks.find(t => t.id === trackId);
            if (track) updateTrack(trackId, { solo: !track.solo });
          }}
          onMasterVolumeChange={setMasterVolume}
        />
      )}

      {/* Export modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        projectName={project.name}
      />
    </div>
  );
};
