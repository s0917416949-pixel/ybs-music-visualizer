import React from 'react';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';

const AUDIO = staticFile('song.wav');

const getSectionBoost = (seconds: number) => {
  if (seconds < 16) return 0.52;
  if (seconds < 45) return 0.70;
  if (seconds < 58) return 0.88;
  if (seconds < 95) return 1.12;
  if (seconds < 123) return 0.74;
  if (seconds < 132) return 0.90;
  if (seconds < 165) return 1.16;
  if (seconds < 167.3) return 0.80;
  if (seconds < 192) return 1.02;
  if (seconds < 201) return 1.12;
  if (seconds < 209.5) return 0.66;
  if (seconds < 214.3) return 0.92;
  if (seconds < 255) return 1.34;
  if (seconds < 271.5) return 0.76;
  return 0.42;
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
    numberOfSamples: 128,
    dataOffsetInSeconds,
  });

  const seconds = frame / fps;
  const boost = getSectionBoost(seconds);
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

      {values.map((v, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const amplitude = Math.min(1, v * 3.18 * boost);
        const totalLength = 12 + amplitude * 96;

        const inner = baseRadius - totalLength * (0.34 + amplitude * 0.08);
        const outer = baseRadius + totalLength * (0.66 - amplitude * 0.08);

        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;
        const alpha = 0.26 + amplitude * 0.74;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`rgba(236,246,255,${alpha})`}
            strokeWidth={2.2 + amplitude * 2.4}
            strokeLinecap="round"
            filter="url(#spectrumGlow)"
          />
        );
      })}
    </svg>
  );
};
