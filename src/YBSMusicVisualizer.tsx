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

  const journeyGlow = interpolate(
    seconds,
    [0, 58, 95, 132, 165, 201, 215, 255, 273.67],
    [0.06, 0.10, 0.14, 0.16, 0.20, 0.18, 0.24, 0.34, 0.30],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const memoryDim = interpolate(seconds, [165, 178, 201, 211, 215], [0, 0.08, 0.18, 0.24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalBloom = interpolate(seconds, [211, 215, 235, 255], [0, 0.06, 0.22, 0.30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spectrumOpacity = interpolate(seconds, [0, 0.8, 268.5, 273.35], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ambientDrift = interpolate(frame, [0, 273.67 * fps], [-1.5, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundScale = interpolate(seconds, [0, 273.67], [1.14, 1.19], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundX = interpolate(seconds, [0, 273.67], [-1.0, 1.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#070912', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg,
            rgb(${Math.round(8 + journeyGlow * 10)}, ${Math.round(9 + journeyGlow * 8)}, ${Math.round(24 + journeyGlow * 14)}) 0%,
            rgb(${Math.round(15 + journeyGlow * 14)}, ${Math.round(13 + journeyGlow * 10)}, ${Math.round(38 + journeyGlow * 20)}) 42%,
            rgb(${Math.round(34 + journeyGlow * 24)}, ${Math.round(20 + journeyGlow * 16)}, ${Math.round(44 + journeyGlow * 16)}) 70%,
            rgb(${Math.round(11 + journeyGlow * 10)}, ${Math.round(8 + journeyGlow * 8)}, ${Math.round(18 + journeyGlow * 8)}) 100%)`,
          filter: `brightness(${1 - memoryDim * 0.50})`,
        }}
      />

      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile('background.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateX(${backgroundX}%) scale(${backgroundScale})`,
            filter: `blur(22px) brightness(${0.40 + journeyGlow * 0.10 - memoryDim * 0.08}) saturate(${0.82 + journeyGlow * 0.12}) contrast(1.04)`,
            opacity: 0.66,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          translate: `${ambientDrift}% 0`,
          scale: 1.08,
          background: `linear-gradient(112deg,
            rgba(0,0,0,0) 0%,
            rgba(145,111,206,${0.018 + journeyGlow * 0.04}) 38%,
            rgba(255,159,102,${0.020 + journeyGlow * 0.055 + finalBloom * 0.14}) 58%,
            rgba(255,205,148,${0.012 + finalBloom * 0.10}) 70%,
            rgba(0,0,0,0) 86%)`,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(4,2,14,${0.16 + memoryDim * 0.34}) 0%,
            rgba(6,3,16,0.06) 42%,
            rgba(4,3,12,0.54) 100%)`,
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
          filter: 'none',
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
