import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
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

export const YBSMusicVisualizerImage: React.FC<{
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

  const spectrumOpacity = interpolate(seconds, [0, 0.8, 224, 231.5], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const imageScale = interpolate(seconds, [0, 231.88], [1.08, 1.14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const imageX = interpolate(seconds, [0, 231.88], [-1.5, 1.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#050b12', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      {/* Base cinematic color bed */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg,
            rgb(${Math.round(4 + dawn * 10)}, ${Math.round(13 + dawn * 12)}, ${Math.round(25 + dawn * 16)}) 0%,
            rgb(${Math.round(7 + dawn * 13)}, ${Math.round(22 + dawn * 16)}, ${Math.round(37 + dawn * 18)}) 42%,
            rgb(${Math.round(12 + dawn * 18)}, ${Math.round(25 + dawn * 18)}, ${Math.round(38 + dawn * 15)}) 70%,
            rgb(${Math.round(4 + dawn * 8)}, ${Math.round(10 + dawn * 8)}, ${Math.round(18 + dawn * 10)}) 100%)`,
        }}
      />

      {/* Alternate image background. Softened and enlarged so any baked-in center ring does not compete with the live spectrum. */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile('background.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateX(${imageX}%) scale(${imageScale})`,
            filter: `blur(9px) brightness(${0.44 + dawn * 0.12 - bridgeDim * 0.12}) saturate(${0.82 + dawn * 0.16}) contrast(1.05)`,
            opacity: 0.82,
          }}
        />
      </AbsoluteFill>

      {/* Darken the central zone without drawing another circle. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg,
            rgba(3,8,14,0.08) 0%,
            rgba(3,8,14,0.18) 22%,
            rgba(3,8,14,0.56) 43%,
            rgba(3,8,14,0.62) 50%,
            rgba(3,8,14,0.56) 57%,
            rgba(3,8,14,0.18) 78%,
            rgba(3,8,14,0.08) 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(0,4,10,${0.10 + bridgeDim * 0.28}) 0%,
            rgba(0,4,10,0.02) 42%,
            rgba(0,3,8,0.50) 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(110deg,
            rgba(0,0,0,0) 0%,
            rgba(255,198,133,${0.012 + dawn * 0.035 + finalBloom * 0.10}) 46%,
            rgba(218,154,103,${0.018 + dawn * 0.050 + finalBloom * 0.15}) 58%,
            rgba(0,0,0,0) 78%)`,
          mixBlendMode: 'screen',
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
          opacity: 0.72,
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
          opacity: 0.78,
        }}
      >
        Yun
      </div>

      <Lyrics />
      <EndCard />
    </AbsoluteFill>
  );
};
