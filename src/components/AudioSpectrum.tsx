import React from 'react';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';

const AUDIO = staticFile('song.wav');
const CENTER_VISUAL = staticFile('center-circle.png');

const getSectionBoost = (seconds: number) => {
  if (seconds < 62) return 0.78;
  if (seconds < 96) return 1.0;
  if (seconds < 115) return 0.82;
  if (seconds < 145) return 1.08;
  if (seconds < 164) return 0.62;
  if (seconds < 169) return 0.72;
  if (seconds < 174) return 1.02;
  if (seconds < 194) return 1.12;
  if (seconds < 210) return 1.28;
  if (seconds < 228) return 0.72;
  return 0.42;
};

export const AudioSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({
    src: AUDIO,
    frame,
    fps,
    windowInSeconds: 8,
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

  // Keep only the animated outer spectrum. The supplied artwork is clipped into
  // one clean circle inside it, with no extra static spectrum/ring added.
  const baseRadius = 355;
  const imageRadius = 306;
  const imageSize = imageRadius * 2;

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
        <clipPath id="centerVisualClip">
          <circle cx={cx} cy={cy} r={imageRadius} />
        </clipPath>
      </defs>

      <image
        href={CENTER_VISUAL}
        x={cx - imageRadius}
        y={cy - imageRadius}
        width={imageSize}
        height={imageSize}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#centerVisualClip)"
      />

      {values.map((v, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const amplitude = Math.min(1, v * 2.9 * boost);
        const totalLength = 12 + amplitude * 92;

        // Split movement across both sides of the base radius so the visualizer
        // remains one organic animated ring rather than creating a static inner ring.
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
