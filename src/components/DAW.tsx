import { useState, useRef, useEffect } from 'react'
import { DAWState, Project, TransportState, Track } from '../types/audio'

const DAW = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    if (audioContextRef.current.state === 'suspended') {
      const resumeAudio = async () => {
        await audioContextRef.current?.resume()
      }
      document.addEventListener('click', resumeAudio, { once: true })
    }
  }, [])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="daw-container">
      <div className="transport">
        <button onClick={handlePlay} className="play-btn">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className="time-display">
          Time: {currentTime.toFixed(2)}s
        </div>
      </div>
      
      <div className="tracks-container">
        <div className="track">
          <div className="track-header">
            <span>Track 1</span>
            <button>Mute</button>
            <button>Solo</button>
          </div>
          <div className="track-timeline">
            <div className="clip">Audio Clip 1</div>
          </div>
        </div>
      </div>

      <div className="mixer">
        <h3>Mixer</h3>
        <div className="controls">
          <label>Volume: <input type="range" min="0" max="100" defaultValue="75" /></label>
          <label>Pan: <input type="range" min="-100" max="100" defaultValue="0" /></label>
        </div>
      </div>
    </div>
  )
}

export default DAW
