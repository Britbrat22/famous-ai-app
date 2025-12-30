import { useState, useEffect } from 'react'

const DAW = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context
    const initAudio = () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      setAudioContext(ctx)
    }
    
    initAudio()
  }, [])

  const handlePlay = () => {
    if (audioContext) {
      // Simple beep sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1)
      
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 1000)
    }
  }

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)', 
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎵 Famous AI DAW</h1>
      <h2>React Version</h2>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handlePlay}
          style={{
            background: isPlaying ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          {isPlaying ? '🔊 PLAYING' : '▶️ PLAY TONE'}
        </button>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h3>Track 1</h3>
        <p>Audio Context: {audioContext ? '✅ Ready' : '⏳ Initializing...'}</p>
        <p>Status: {isPlaying ? '🔊 Playing' : '⏹️ Stopped'}</p>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px'
      }}>
        <h3>Mixer</h3>
        <label>Volume: <input type="range" min="0" max="100" defaultValue="75" /></label><br/>
        <label>Pan: <input type="range" min="-100" max="100" defaultValue="0" /></label><br/>
        <label>BPM: <input type="range" min="60" max="180" defaultValue="120" /></label>
      </div>
    </div>
  )
}

export default DAW
