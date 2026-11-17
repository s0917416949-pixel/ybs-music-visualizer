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

export const YBSMusicVisualizer: React.FC<{
  title: string;
  series: string;
  artist: string;
}> = ({title, series, artist}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;

  // Vol.04 moves from quiet reflection toward warmer understanding.
  const understandingGlow = interpolate(
    seconds,
    [0, 44, 58, 90, 120, 133, 163, 180, 198, 232, 257.2],
    [0.07, 0.09, 0.15, 0.19, 0.14, 0.20, 0.23, 0.15, 0.25, 0.38, 0.30],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const reflectionDim = interpolate(
    seconds,
    [160, 166, 180, 196, 198],
    [0, 0.12, 0.18, 0.24, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const finalBloom = interpolate(seconds, [196, 198, 218, 232], [0, 0.06, 0.24, 0.34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spectrumOpacity = interpolate(seconds, [0, 0.8, 250.0, 257.0], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ambientDrift = interpolate(frame, [0, 257.2 * fps], [-1.2, 1.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundScale = interpolate(seconds, [0, 257.2], [1.12, 1.17], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundX = interpolate(seconds, [0, 257.2], [-0.8, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#0c1018', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      {/* Warm dusk / cool shadow foundation */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg,
            rgb(${Math.round(10 + understandingGlow * 12)}, ${Math.round(15 + understandingGlow * 12)}, ${Math.round(25 + understandingGlow * 16)}) 0%,
            rgb(${Math.round(18 + understandingGlow * 18)}, ${Math.round(24 + understandingGlow * 15)}, ${Math.round(35 + understandingGlow * 12)}) 42%,
            rgb(${Math.round(50 + understandingGlow * 52)}, ${Math.round(35 + understandingGlow * 35)}, ${Math.round(30 + understandingGlow * 22)}) 72%,
            rgb(${Math.round(15 + understandingGlow * 12)}, ${Math.round(15 + understandingGlow * 10)}, ${Math.round(20 + understandingGlow * 8)}) 100%)`,
          filter: `brightness(${1 - reflectionDim * 0.46})`,
        }}
      />

      {/* Blurred story layer */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile('background.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateX(${backgroundX}%) scale(${backgroundScale})`,
            filter: `blur(20px) brightness(${0.42 + understandingGlow * 0.10 - reflectionDim * 0.08}) saturate(${0.78 + understandingGlow * 0.16}) contrast(1.04)`,
            opacity: 0.68,
          }}
        />
      </AbsoluteFill>

      {/* Slow amber light drifting through the frame */}
      <AbsoluteFill
        style={{
          translate: `${ambientDrift}% 0`,
          scale: 1.08,
          background: `linear-gradient(112deg,
            rgba(0,0,0,0) 0%,
            rgba(110,142,170,${0.014 + understandingGlow * 0.026}) 32%,
            rgba(214,157,102,${0.020 + understandingGlow * 0.060 + finalBloom * 0.12}) 56%,
            rgba(255,207,150,${0.014 + understandingGlow * 0.044 + finalBloom * 0.13}) 70%,
            rgba(0,0,0,0) 88%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Bridge and FINAL-before become quieter before the last chorus opens. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(6,10,18,${0.13 + reflectionDim * 0.34}) 0%,
            rgba(8,10,16,0.04) 43%,
            rgba(7,8,13,0.48) 100%)`,
        }}
      />

      <Img
        src={staticFile('center-circle.png')}
        style={{
          position: 'absolute',
          left: 654,
          top: 164,
          width: 612,
          height: 612,
          objectFit: 'cover',
          borderRadius: '50%',
          filter: `brightness(${0.98 + finalBloom * 0.08}) saturate(${0.98 + understandingGlow * 0.08})`,
          opacity: 1,
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
          color: 'rgba(247,244,236,0.64)',
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
          color: 'rgba(250,247,239,0.84)',
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
