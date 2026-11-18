import type {V3} from '../lego/Brick';

export const FPS = 30;
export const DURATION = 18_000;

export type SceneId =
  | 'intro'
  | 'prep'
  | 'chassis'
  | 'axle'
  | 'engine'
  | 'drivetrain'
  | 'wheels'
  | 'lowerbody'
  | 'upperbody'
  | 'interior'
  | 'details'
  | 'test'
  | 'finale';

export type Scene = {
  id: SceneId;
  label: string;
  from: number;
  dur: number;
  stepStart?: number;
  stepEnd?: number;
};

/** Exact 10-minute timeline from the supplied production script. */
export const SCENES: readonly Scene[] = [
  {id: 'intro', label: 'Intro', from: 0, dur: 750},
  {id: 'prep', label: 'Persiapan', from: 750, dur: 1200},
  {id: 'chassis', label: 'Rangka chassis', from: 1950, dur: 1800, stepStart: 1, stepEnd: 6},
  {id: 'axle', label: 'Gardan dan suspensi', from: 3750, dur: 1800, stepStart: 7, stepEnd: 12},
  {id: 'engine', label: 'Mesin V8', from: 5550, dur: 2100, stepStart: 13, stepEnd: 19},
  {id: 'drivetrain', label: 'Drivetrain', from: 7650, dur: 1350, stepStart: 20, stepEnd: 24},
  {id: 'wheels', label: 'Roda', from: 9000, dur: 1800, stepStart: 25, stepEnd: 30},
  {id: 'lowerbody', label: 'Bodi bawah', from: 10800, dur: 1800, stepStart: 31, stepEnd: 36},
  {id: 'upperbody', label: 'Bodi atas', from: 12600, dur: 1800, stepStart: 37, stepEnd: 43},
  {id: 'interior', label: 'Interior', from: 14400, dur: 1200, stepStart: 44, stepEnd: 47},
  {id: 'details', label: 'Detail akhir', from: 15600, dur: 900, stepStart: 48, stepEnd: 50},
  {id: 'test', label: 'Uji nyala', from: 16500, dur: 900},
  {id: 'finale', label: 'Finale', from: 17400, dur: 600},
] as const;

export type CameraPose = {pos: V3; target: V3; fov: number};
export type Shot = {f0: number; f1: number; from: CameraPose; to: CameraPose};

const POSES: readonly CameraPose[] = [
  {pos: [22, 16, 31], target: [0, 3.5, 0], fov: 30}, // wide
  {pos: [16, 9, 22], target: [0, 2.5, 1], fov: 28}, // medium
  {pos: [10, 6, 13], target: [0, 2.2, 2.5], fov: 22}, // front macro
  {pos: [-14, 8, 18], target: [0, 2.4, 0], fov: 25}, // left medium
  {pos: [7, 4.5, -13], target: [0, 2.2, 0], fov: 20}, // rear macro
  {pos: [0, 25, 3], target: [0, 0, 0], fov: 30}, // top-down
  {pos: [17, 4.2, 10], target: [0, 1.3, 0], fov: 20}, // low close
  {pos: [-22, 12, 25], target: [0, 3.4, -1], fov: 30}, // hero wide
] as const;

const SCENE_TARGETS: Record<SceneId, V3> = {
  intro: [0, 3.5, 0],
  prep: [-5, 2.5, 2],
  chassis: [0, 2.7, 0],
  axle: [0, 1.4, 0],
  engine: [0, 3.5, -1.5],
  drivetrain: [0, 1.45, -2],
  wheels: [0, 1.4, 0],
  lowerbody: [0, 2.2, 0],
  upperbody: [0, 3.5, 0],
  interior: [0, 3.6, 1],
  details: [0, 2.6, 8],
  test: [0, 2.5, 6],
  finale: [0, 2.4, 2],
};

const poseFor = (index: number, target: V3): CameraPose => {
  const base = POSES[index % POSES.length];
  return {
    pos: base.pos,
    target: [
      target[0] * 0.82 + base.target[0] * 0.18,
      target[1] * 0.82 + base.target[1] * 0.18,
      target[2] * 0.82 + base.target[2] * 0.18,
    ],
    fov: base.fov,
  };
};

/**
 * A deterministic 6-second editorial cadence. It creates 100 keyframed shots
 * across the 10-minute film and alternates wide, medium, macro, and top views.
 */
export const CAMERA_SHOTS: readonly Shot[] = SCENES.flatMap((scene, sceneIndex) => {
  const shotLength = 180;
  const shots: Shot[] = [];
  const target = SCENE_TARGETS[scene.id];
  for (let from = scene.from, localIndex = 0; from < scene.from + scene.dur; from += shotLength, localIndex += 1) {
    const to = Math.min(from + shotLength, scene.from + scene.dur);
    shots.push({
      f0: from,
      f1: to,
      from: poseFor(sceneIndex * 3 + localIndex, target),
      to: poseFor(sceneIndex * 3 + localIndex + 1, target),
    });
  }
  return shots;
});

export const sceneForFrame = (frame: number): Scene =>
  SCENES.find((scene) => frame >= scene.from && frame < scene.from + scene.dur) ?? SCENES[SCENES.length - 1];

export const sceneProgress = (frame: number, scene: Scene) =>
  Math.max(0, Math.min(1, (frame - scene.from) / Math.max(1, scene.dur)));

export const stepForFrame = (frame: number): number => {
  const scene = sceneForFrame(frame);
  if (!scene.stepStart || !scene.stepEnd) return frame >= 16500 ? 50 : 0;
  const progress = sceneProgress(frame, scene);
  return Math.min(scene.stepEnd, scene.stepStart + Math.floor(progress * (scene.stepEnd - scene.stepStart + 1)));
};
