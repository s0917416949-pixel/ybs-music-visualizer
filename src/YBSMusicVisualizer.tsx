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

  const dawn = interpolate(seconds, [0, 45, 71, 101, 129, 158, 179, 217, 243, 259.6], [0.02, 0.04, 0.07, 0.11, 0.15, 0.20, 0.27, 0.39, 0.47, 0.52], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bridgeDim = interpolate(seconds, [158, 166, 174, 179], [0, 0.16, 0.22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalBloom = interpolate(seconds, [179, 199, 217, 243], [0, 0.08, 0.23, 0.34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spectrumOpacity = interpolate(seconds, [0, 0.8, 248, 259.2], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ambientDrift = interpolate(frame, [0, 259.6 * fps], [-2, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundScale = interpolate(seconds, [0, 259.6], [1.16, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundX = interpolate(seconds, [0, 259.6], [-1.2, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#050b12', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

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

      {/* Blurred background only. This layer must never affect the center artwork. */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile('background.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateX(${backgroundX}%) scale(${backgroundScale})`,
            filter: `blur(22px) brightness(${0.56 + dawn * 0.12 - bridgeDim * 0.04}) saturate(${0.84 + dawn * 0.12}) contrast(1.03)`,
            opacity: 0.82,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          translate: `${ambientDrift}% 0`,
          scale: 1.08,
          background: `linear-gradient(110deg,
            rgba(0,0,0,0) 0%,
            rgba(255,198,133,${0.012 + dawn * 0.075 + finalBloom * 0.14}) 46%,
            rgba(218,154,103,${0.018 + dawn * 0.095 + finalBloom * 0.20}) 58%,
            rgba(0,0,0,0) 78%)`,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(0,4,10,${0.12 + bridgeDim * 0.24}) 0%,
            rgba(0,4,10,0.04) 42%,
            rgba(0,3,8,0.34) 100%)`,
        }}
      />

      {/* Independent sharp center artwork. It is intentionally outside the blurred
          background and outside AudioSpectrum so it stays sharp for the full song. */}
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
