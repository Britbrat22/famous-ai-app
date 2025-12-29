import React, { useRef, useEffect } from 'react';

interface SpectrumAnalyzerProps {
  data: Uint8Array;
  width: number;
  height: number;
  color?: string;
  barCount?: number;
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  data,
  width,
  height,
  color = '#00d4ff',
  barCount = 32,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for retina
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate bar dimensions
    const barWidth = width / barCount - 2;
    const step = Math.floor(data.length / barCount);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, '#ff6b6b');

    ctx.fillStyle = gradient;

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const value = data[i * step] || 0;
      const barHeight = (value / 255) * height;
      const x = i * (barWidth + 2);
      const y = height - barHeight;

      // Draw bar with rounded top
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }, [data, width, height, color, barCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="rounded"
    />
  );
};
