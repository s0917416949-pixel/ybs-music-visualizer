import React from 'react';
import {Composition} from 'remotion';
import {YBSMusicVisualizer} from './YBSMusicVisualizer';
import {YBSMusicVisualizerImage} from './YBSMusicVisualizerImage';
import {YBSMusicVisualizerC} from './YBSMusicVisualizerC';

const FPS = 30;
const DURATION_SECONDS = 259.6;

const defaultProps = {
  title: '明天醒來以後',
  series: '未來系列 Vol.01',
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
      <Composition
        id="YBSMusicVisualizerC"
        component={YBSMusicVisualizerC}
        durationInFrames={Math.ceil(DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
