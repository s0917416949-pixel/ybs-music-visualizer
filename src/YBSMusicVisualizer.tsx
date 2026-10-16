import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
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

  const backgroundScale = interpolate(frame, [0, 231.88 * fps], [1.02, 1.075], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

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

  const spectrumOpacity = interpolate(seconds, [0, 4, 224, 231.5], [0.25, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#050b12', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      <Img
        src={staticFile('background.png')}
        style={{
          position: 'absolute',
          inset: -40,
          width: 2000,
          height: 1160,
          objectFit: 'cover',
          scale: backgroundScale,
          filter: `brightness(${0.72 + dawn * 0.48 - bridgeDim}) saturate(${0.9 + dawn * 0.28}) contrast(1.04)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(2,8,16,${0.34 - dawn * 0.12}) 0%, rgba(3,10,18,0.08) 46%, rgba(2,6,12,0.58) 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 39%, rgba(255,204,142,${dawn * 0.18 + finalBloom}) 0%, rgba(255,185,116,${dawn * 0.07}) 28%, rgba(0,0,0,0) 62%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Hide the baked-in static spectrum from background.png while preserving the circular visual concept. */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 335,
          top: 470 - 335,
          width: 670,
          height: 670,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8,18,30,0.96) 0%, rgba(8,18,30,0.90) 58%, rgba(8,18,30,0.70) 76%, rgba(8,18,30,0) 100%)',
          boxShadow: '0 0 80px rgba(0,0,0,0.28) inset',
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
        }}
      >
        {seconds > 6 ? series : ''}
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
        }}
      >
        {seconds > 6 ? 'Yun' : ''}
      </div>

      <Lyrics />
      <EndCard />
    </AbsoluteFill>
  );
};
