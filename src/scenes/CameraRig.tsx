import {useThree} from '@react-three/fiber';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {PerspectiveCamera} from 'three';
import {CAMERA_SHOTS, type CameraPose, type Shot} from './timeline';

const blend = (from: CameraPose, to: CameraPose, t: number) => ({
  pos: from.pos.map((value, index) => value + (to.pos[index] - value) * t) as CameraPose['pos'],
  target: from.target.map((value, index) => value + (to.target[index] - value) * t) as CameraPose['target'],
  fov: from.fov + (to.fov - from.fov) * t,
});

/** Uses only Remotion's frame clock; no live Three.js clock is used. */
export const CameraRig: React.FC<{shots?: readonly Shot[]}> = ({shots = CAMERA_SHOTS}) => {
  const frame = useCurrentFrame();
  const {camera} = useThree();
  const active = shots.find((shot) => frame >= shot.f0 && frame < shot.f1) ?? shots[shots.length - 1];
  const t = interpolate(frame, [active.f0, active.f1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const pose = blend(active.from, active.to, t);
  const perspective = camera as PerspectiveCamera;

  perspective.position.set(...pose.pos);
  perspective.lookAt(...pose.target);
  perspective.fov = pose.fov;
  perspective.updateProjectionMatrix();
  return null;
};
