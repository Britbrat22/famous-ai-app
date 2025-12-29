import React, { useRef, useEffect } from 'react';

interface WaveformProps {
  data: number[];
  color: string;
  height: number;
  width: number;
  className?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  data,
  color,
  height,
  width,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width * 2; // For retina
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / data.length;
    const centerY = height / 2;

    ctx.fillStyle = color;

    data.forEach((value, index) => {
      const barHeight = value * (height - 4);
      const x = index * barWidth;
      const y = centerY - barHeight / 2;

      // Draw rounded bars
      ctx.beginPath();
      ctx.roundRect(x, y, Math.max(1, barWidth - 1), barHeight, 1);
      ctx.fill();
    });
  }, [data, color, height, width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
    />
  );
};

// Generate fake waveform data for demo purposes
export const generateFakeWaveform = (length: number = 200): number[] => {
  const waveform: number[] = [];
  let value = 0.3;
  
  for (let i = 0; i < length; i++) {
    // Create natural-looking audio waveform
    const noise = (Math.random() - 0.5) * 0.3;
    const wave = Math.sin(i * 0.1) * 0.2;
    const envelope = Math.sin((i / length) * Math.PI) * 0.3;
    
    value = Math.max(0.1, Math.min(1, value + noise));
    waveform.push(value * 0.5 + wave + envelope + 0.2);
  }
  
  // Normalize
  const max = Math.max(...waveform);
  return waveform.map(v => Math.min(1, v / max));
};
