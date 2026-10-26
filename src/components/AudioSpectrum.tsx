import React from 'react';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';

const AUDIO = staticFile('song.wav');

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getSectionBoost = (seconds: number) => {
  if (seconds < 14) return 0.65;
  if (seconds < 45) return 0.78;
  if (seconds < 71) return 0.90;
  if (seconds < 101) return 1.16;
  if (seconds < 129) return 0.82;
  if (seconds < 158) return 1.20;
  if (seconds < 179) return 0.72;
  if (seconds < 199) return 1.26;
  if (seconds < 217) return 1.42;
  if (seconds < 243) return 0.90;
  return 0.50;
};

export const AudioSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({
    src: AUDIO,
    frame,
    fps,
    windowInSeconds: 6,
  });

  if (!audioData) return null;

  const values = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 64,
    dataOffsetInSeconds,
  });

  const seconds = frame / fps;
  const boost = getSectionBoost(seconds);
  const globalEnergy = clamp01(average(values) * 6.0);
  const lowEnergy = clamp01(average(values.slice(0, 12)) * 7.5);
  const breath = 0.06 + ((Math.sin((seconds * Math.PI * 2) / 4.8) + 1) / 2) * 0.05;

  const cx = 960;
  const cy = 470;
  const baseRadius = 355;
  const barCount = 128;

  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0}}
    >
      <defs>
        <filter id="spectrumGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({length: barCount}).map((_, i) => {
        const angle = (Math.PI * 2 * i) / barCount - Math.PI / 2;
        const sourceIndex = i < values.length ? i : barCount - 1 - i;
        const safeIndex = Math.max(0, Math.min(values.length - 1, sourceIndex));
        const mirroredIndex = values.length - 1 - safeIndex;
        const local = (values[safeIndex] ?? 0) * 0.78 + (values[mirroredIndex] ?? 0) * 0.22;
        const prev = values[Math.max(0, safeIndex - 1)] ?? 0;
        const next = values[Math.min(values.length - 1, safeIndex + 1)] ?? 0;
        const smoothed = local * 0.72 + ((prev + next) / 2) * 0.28;
        const quadrantPulse = 0.94 + 0.06 * Math.sin(angle * 4 + seconds * 1.4);
        const amplitude = clamp01(
          breath + globalEnergy * 0.18 + lowEnergy * 0.12 + smoothed * 4.6 * boost * quadrantPulse,
        );
        const totalLength = 18 + amplitude * 120 + lowEnergy * 14;

        const inner = baseRadius - totalLength * (0.25 + amplitude * 0.03);
        const outer = baseRadius + totalLength * (0.75 - amplitude * 0.03);

        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;
        const alpha = 0.30 + amplitude * 0.70;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={'rgba(236,246,255,' + alpha + ')'}
            strokeWidth={2.1 + amplitude * 3.1}
            strokeLinecap="round"
            filter="url(#spectrumGlow)"
          />
        );
      })}
    </svg>
  );
};
