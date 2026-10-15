import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const start = 227.2;
  if (seconds < start) return null;

  const opacity = interpolate(seconds, [227.2, 228.2, 230.9, 231.8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        opacity,
        color: '#faf7ef',
        background: 'rgba(5,11,18,0.22)',
        textShadow: '0 4px 24px rgba(0,0,0,0.8)',
      }}
    >
      <div style={{fontSize: 54, lineHeight: 1.55, letterSpacing: '0.08em', fontWeight: 600}}>
        後來不是終點
        <br />
        只是下一段故事開始的地方
      </div>
      <div style={{fontSize: 30, letterSpacing: '0.35em', marginTop: 38, opacity: 0.9}}>Yun</div>
    </div>
  );
};
