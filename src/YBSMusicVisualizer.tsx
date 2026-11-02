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

  const morningLift = interpolate(
    seconds,
    [0, 55, 124, 159, 184, 196, 234, 259.52],
    [0.06, 0.10, 0.16, 0.22, 0.18, 0.28, 0.40, 0.44],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const decisionDim = interpolate(seconds, [158, 176, 184, 194, 197], [0, 0.08, 0.16, 0.24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalBloom = interpolate(seconds, [194, 197, 218, 234], [0, 0.08, 0.24, 0.34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spectrumOpacity = interpolate(seconds, [0, 0.8, 254.3, 259.2], [0.86, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ambientDrift = interpolate(frame, [0, 259.52 * fps], [-2, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundScale = interpolate(seconds, [0, 259.52], [1.14, 1.20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backgroundX = interpolate(seconds, [0, 259.52], [-1.0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#080d12', overflow: 'hidden', fontFamily: ybsFontFamily}}>
      <Audio src={staticFile('song.wav')} />

      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg,
            rgb(${Math.round(8 + morningLift * 18)}, ${Math.round(17 + morningLift * 20)}, ${Math.round(28 + morningLift * 18)}) 0%,
            rgb(${Math.round(14 + morningLift * 24)}, ${Math.round(27 + morningLift * 24)}, ${Math.round(39 + morningLift * 20)}) 44%,
            rgb(${Math.round(28 + morningLift * 30)}, ${Math.round(34 + morningLift * 23)}, ${Math.round(40 + morningLift * 16)}) 72%,
            rgb(${Math.round(10 + morningLift * 16)}, ${Math.round(14 + morningLift * 14)}, ${Math.round(20 + morningLift * 12)}) 100%)`,
          filter: `brightness(${1 - decisionDim * 0.5})`,
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
            filter: `blur(22px) brightness(${0.60 + morningLift * 0.10 - decisionDim * 0.07}) saturate(${0.88 + morningLift * 0.10}) contrast(1.03)`,
            opacity: 0.84,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          translate: `${ambientDrift}% 0`,
          scale: 1.08,
          background: `linear-gradient(110deg,
            rgba(0,0,0,0) 0%,
            rgba(255,208,145,${0.018 + morningLift * 0.075 + finalBloom * 0.14}) 45%,
            rgba(241,170,108,${0.026 + morningLift * 0.10 + finalBloom * 0.22}) 60%,
            rgba(0,0,0,0) 80%)`,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(0,4,10,${0.10 + decisionDim * 0.30}) 0%,
            rgba(0,4,10,0.03) 42%,
            rgba(0,3,8,0.30) 100%)`,
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
