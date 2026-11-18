import {Easing, interpolate} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A deterministic lift, press, and settle animation for a LEGO connection. */
export const snapIn = (frame: number, start: number, duration = 12, liftHeight = 1.5) => {
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const press = interpolate(frame, [start + duration, start + duration + 3, start + duration + 8], [0, -0.06, 0], clamp);
  return {
    progress: t,
    lift: (1 - t) * liftHeight,
    press,
    scale: 0.93 + t * 0.07,
  };
};

export const visibleAfter = (frame: number, start: number) => Math.max(0.001, Math.min(1, (frame - start + 1) / 2));
