import React from 'react';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';

const AUDIO = staticFile('song.wav');

const getSectionBoost = (seconds: number) => {
  if (seconds < 15.9) return 0.54;
  if (seconds < 44.4) return 0.72;
  if (seconds < 57.8) return 0.90;
  if (seconds < 90.5) return 1.12;
  if (seconds < 119.8) return 0.76;
  if (seconds < 133.3) return 0.92;
  if (seconds < 163.0) return 1.16;
  if (seconds < 180.2) return 0.78;
  if (seconds < 198.1) return 0.72;
  if (seconds < 231.7) return 1.30;
  if (seconds < 245.5) return 0.80;
  return 0.46;
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const AudioSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({
    src: AUDIO,
    frame,
    fps,
    windowInSeconds: 5,
  });

  if (!audioData) return null;

  const values = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 128,
    dataOffsetInSeconds,
  });

  const seconds = frame / fps;
  const boost = getSectionBoost(seconds);
  const globalEnergy = average(values);

  const lowEnergy = average(values.slice(0, 24));
  const midEnergy = average(values.slice(24, 72));
  const highEnergy = average(values.slice(72, 128));

  const cx = 960;
  const cy = 470;
  const baseRadius = 355;

  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0}}
    >
      <defs>
        <filter id="spectrumGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({length: 256}).map((_, i) => {
        // Smoothly cycle the usable spectrum around the circle twice.
        // This spreads low/mid/high energy across all four directions without
        // introducing hard quadrant seams or changing the radial bar angles.
        const groupSize = 5;
        const groupIndex = Math.floor(i / groupSize);
        const withinGroup = i % groupSize;

        // Scatter frequency bins around the whole ring instead of mapping them
        // sequentially from top to bottom. 29 is coprime with 128, so every
        // group walks through a different part of the spectrum before repeating.
        const baseIndex = (groupIndex * 29 + withinGroup * 7) % 128;

        // Blend three separated bins so each area of the circle can react to
        // low/mid/high energy, not just whichever quiet band lands there.
        const a = values[baseIndex] ?? 0;
        const b = values[(baseIndex + 43) % 128] ?? 0;
        const d = values[(baseIndex + 86) % 128] ?? 0;
        const localEnergy = Math.max(a, b * 0.88, d * 0.76);

        const angle = (Math.PI * 2 * i) / 256 - Math.PI / 2;

        // Gentle frequency-band rotation around the circle so no quadrant
        // depends only on quiet high frequencies.
        const phase = angle + Math.PI / 2;
        const lowWeight = 0.30 + 0.18 * (0.5 + 0.5 * Math.sin(phase));
        const midWeight = 0.28 + 0.16 * (0.5 + 0.5 * Math.sin(phase + 2.1));
        const highWeight = 0.12 + 0.08 * (0.5 + 0.5 * Math.sin(phase + 4.2));
        const bandBreath =
          lowEnergy * lowWeight +
          midEnergy * midWeight +
          highEnergy * highWeight;

        const microPulse = 0.94 + ((groupIndex % 5) * 0.025);

        const groupPulse = 0.92 + ((groupIndex % 6) * 0.022);

        const reactiveEnergy =
          (localEnergy * 0.66 +
            bandBreath * 0.18 +
            globalEnergy * 0.16) *
          groupPulse;

        const baseBreath = Math.min(0.22, globalEnergy * 1.70 * boost);
        const amplitude = Math.min(
          1,
          Math.max(baseBreath, reactiveEnergy * 3.35 * boost),
        );

        // Slightly longer than the previous Vol.04 pass.
        const totalLength = 18 + amplitude * 154;

        const inner = baseRadius - totalLength * (0.34 + amplitude * 0.08);
        const outer = baseRadius + totalLength * (0.66 - amplitude * 0.08);

        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;

        const alpha = 0.28 + amplitude * 0.72;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`rgba(244,244,238,${alpha})`}
            strokeWidth={1.9 + amplitude * 2.1}
            strokeLinecap="round"
            filter="url(#spectrumGlow)"
          />
        );
      })}
    </svg>
  );
};
