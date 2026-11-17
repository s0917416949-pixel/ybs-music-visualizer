import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ybsFontFamily} from '../fonts';

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const start = 247.0;
  if (seconds < start) return null;

  const opacity = interpolate(seconds, [247.0, 247.8, 255.8, 257.1], [0, 1, 1, 0], {
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
        color: '#fbf4e8',
        background: 'rgba(10,10,17,0.26)',
        textShadow: '0 4px 24px rgba(0,0,0,0.82)',
        fontFamily: ybsFontFamily,
      }}
    >
      <div style={{fontSize: 54, lineHeight: 1.55, letterSpacing: '0.08em', fontWeight: 600}}>
        不是所有答案
        <br />
        都要現在明白
      </div>
      <div style={{fontSize: 30, letterSpacing: '0.35em', marginTop: 38, opacity: 0.9}}>Yun</div>
    </div>
  );
};
