import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AudioSpectrum} from './components/AudioSpectrum';
import {EndCard} from './components/EndCard';
import {Lyrics} from './components/Lyrics';
import {OpeningTitle} from './components/OpeningTitle';
import {ybsFontFamily} from './fonts';

export const YBSMusicVisualizer: React.FC<{
  title: string;
  series: string;
  artist: string;
}> = ({title, series, artist}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  const dawn = interpolate(seconds, [0, 145, 174, 210, 231.8], [0.02, 0.10, 0.22, 0.42, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bridgeDim = interpolate(seconds, [145, 155, 164, 174], [0, 0.24, 0.28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalBloom = interpolate(seconds, [174, 194, 210], [0, 0.16, 0.32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Keep the one real audio spectrum visible from the first frame.
  const spectrumOpacity = interpolate(seconds, [0, 0.8, 224, 231.5], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Corner branding fades in after the opening title instead of appearing as a hard 6-second switch.
  const cornerOpacity = interpolate(seconds, [5.2, 6.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const ambientDrift = interpolate(frame, [0, 231.88 * fps], [-2, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#050b12', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      {/* Pure programmatic cinematic background. No background.png is shown, so no baked-in ring can remain. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg,
            rgb(${Math.round(4 + dawn * 10)}, ${Math.round(13 + dawn * 12)}, ${Math.round(25 + dawn * 16)}) 0%,
            rgb(${Math.round(7 + dawn * 13)}, ${Math.round(22 + dawn * 16)}, ${Math.round(37 + dawn * 18)}) 42%,
            rgb(${Math.round(12 + dawn * 18)}, ${Math.round(25 + dawn * 18)}, ${Math.round(38 + dawn * 15)}) 70%,
            rgb(${Math.round(4 + dawn * 8)}, ${Math.round(10 + dawn * 8)}, ${Math.round(18 + dawn * 10)}) 100%)`,
          filter: `brightness(${1 - bridgeDim * 0.55})`,
        }}
      />

      <AbsoluteFill
        style={{
          translate: `${ambientDrift}% 0`,
          scale: 1.08,
          background: `radial-gradient(ellipse 66% 54% at 66% 31%,
            rgba(255,198,133,${0.035 + dawn * 0.13 + finalBloom * 0.34}) 0%,
            rgba(218,154,103,${0.018 + dawn * 0.05}) 42%,
            rgba(0,0,0,0) 78%)`,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(0,4,10,${0.14 + bridgeDim * 0.32}) 0%,
            rgba(0,4,10,0.02) 42%,
            rgba(0,3,8,0.48) 100%)`,
        }}
      />

      <div style={{opacity: spectrumOpacity}}>
        <AudioSpectrum />
      </div>

      <OpeningTitle title={title} series={series} artist={artist} />

      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 58,
          fontSize: 20,
          letterSpacing: '0.14em',
          color: 'rgba(245,247,248,0.62)',
          textShadow: '0 2px 12px rgba(0,0,0,0.75)',
          fontFamily: ybsFontFamily,
          opacity: cornerOpacity,
        }}
      >
        {series}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 44,
          right: 58,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.24em',
          color: 'rgba(250,250,247,0.82)',
          textShadow: '0 2px 12px rgba(0,0,0,0.75)',
          fontFamily: ybsFontFamily,
          opacity: cornerOpacity,
        }}
      >
        Yun
      </div>

      <Lyrics />
      <EndCard />
    </AbsoluteFill>
  );
};
