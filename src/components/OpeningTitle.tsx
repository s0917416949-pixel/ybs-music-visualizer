import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ybsFontFamily} from '../fonts';

export const OpeningTitle: React.FC<{
  title: string;
  series: string;
  artist: string;
}> = ({title, series, artist}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, 0.7 * fps, 4.2 * fps, 5.2 * fps], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(frame, [0, 5 * fps], [0.985, 1.015], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        scale,
        textAlign: 'center',
        color: '#f8f5ee',
        textShadow: '0 4px 26px rgba(0,0,0,0.9)',
        pointerEvents: 'none',
        fontFamily: ybsFontFamily,
      }}
    >
      <div style={{fontSize: 28, letterSpacing: '0.22em', marginBottom: 22, opacity: 0.9}}>{series}</div>
      <div style={{fontSize: 68, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 28}}>《{title}》</div>
      <div style={{fontSize: 30, letterSpacing: '0.3em', opacity: 0.92}}>{artist}</div>
    </div>
  );
};
