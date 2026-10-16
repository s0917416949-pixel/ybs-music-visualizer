import React from 'react';
import {Composition} from 'remotion';
import {YBSMusicVisualizer} from './YBSMusicVisualizer';
import {YBSMusicVisualizerImage} from './YBSMusicVisualizerImage';

const FPS = 30;
const DURATION_SECONDS = 231.88;

const defaultProps = {
  title: '後來，我也成為了後來',
  series: '後來系列 FINAL Vol.06',
  artist: 'Yun',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="YBSMusicVisualizer"
        component={YBSMusicVisualizer}
        durationInFrames={Math.ceil(DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
      <Composition
        id="YBSMusicVisualizerImage"
        component={YBSMusicVisualizerImage}
        durationInFrames={Math.ceil(DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
