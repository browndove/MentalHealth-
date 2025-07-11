
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  stream: MediaStream;
  isMuted: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream, isMuted }) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (stream && !isMuted) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
      const analyser = analyserRef.current;

      if (!sourceRef.current || sourceRef.current.mediaStream.id !== stream.id) {
         if (sourceRef.current) {
           sourceRef.current.disconnect();
         }
        sourceRef.current = audioContext.createMediaStreamSource(stream);
        sourceRef.current.connect(analyser);
      }

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        dataArray.forEach(value => (sum += value));
        const avg = sum / dataArray.length;
        setVolume(avg / 128); // Normalize to 0-1 range
        animationFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stream, isMuted]);

  useEffect(() => {
    if (isMuted) {
      setVolume(0);
    }
  }, [isMuted]);

  if (isMuted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-0.5 h-6 w-8 bg-black/30 p-1.5 rounded-md backdrop-blur-sm">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary/70 rounded-full transition-all duration-75",
            i === 0 && 'h-2',
            i === 1 && 'h-4',
            i === 2 && 'h-5',
            i === 3 && 'h-3',
          )}
          style={{ transform: `scaleY(${Math.min(volume * 2, 1)})` }}
        />
      ))}
    </div>
  );
};
