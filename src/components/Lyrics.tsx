import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {Caption} from '@remotion/captions';
import {parseSrt} from '@remotion/captions';
import {
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ybsFontFamily} from '../fonts';

const isSectionMarker = (text: string) => /^【.*】$/.test(text.trim());

export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender('Loading SRT captions'));

  const load = useCallback(async () => {
    try {
      const response = await fetch(staticFile('captions.srt'));
      const text = await response.text();
      const {captions: parsed} = parseSrt({input: text});
      setCaptions(parsed.filter((c) => !isSectionMarker(c.text)));
      continueRender(handle);
    } catch (err) {
      cancelRender(err);
    }
  }, [handle]);

  useEffect(() => {
    load();
  }, [load]);

  const nowMs = (frame / fps) * 1000;
  const active = useMemo(() => {
    if (!captions) return null;
    return captions.find((c) => nowMs >= c.startMs && nowMs <= c.endMs) ?? null;
  }, [captions, nowMs]);

  if (!active) return null;

  const local = nowMs - active.startMs;
  const duration = Math.max(180, active.endMs - active.startMs);
  const opacity = interpolate(
    local,
    [0, Math.min(180, duration * 0.25), Math.max(200, duration - 180), duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const lift = interpolate(local, [0, Math.min(260, duration * 0.5)], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 270,
        right: 270,
        bottom: 105,
        textAlign: 'center',
        opacity,
        translate: `0 ${lift}px`,
        fontFamily: ybsFontFamily,
        fontSize: 48,
        lineHeight: 1.48,
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: 'rgba(248,248,244,0.98)',
        textShadow: '0 3px 18px rgba(0,0,0,0.88), 0 1px 4px rgba(0,0,0,0.92)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {active.text.trim()}
    </div>
  );
};
