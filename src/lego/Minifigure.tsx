import {useMemo} from 'react';
import {ExtrudeGeometry, Shape} from 'three';
import {interpolate, useCurrentFrame} from 'remotion';
import {ABS, LEGO_COLORS, RoundedPart, type V3} from './Brick';

type MinifigureProps = {position?: V3; scale?: number};

const CClipHand: React.FC<{side: -1 | 1; color?: string}> = ({side, color = LEGO_COLORS.yellow}) => {
  const geometry = useMemo(() => {
    const outer = 0.31;
    const inner = 0.16;
    const opening = 0.64;
    const shape = new Shape();
    shape.moveTo(Math.cos(opening) * outer, Math.sin(opening) * outer);
    shape.absarc(0, 0, outer, opening, Math.PI * 2 - opening, false);
    shape.lineTo(Math.cos(Math.PI * 2 - opening) * inner, Math.sin(Math.PI * 2 - opening) * inner);
    shape.absarc(0, 0, inner, Math.PI * 2 - opening, opening, true);
    shape.closePath();
    return new ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSize: 0.028,
      bevelThickness: 0.025,
      bevelSegments: 3,
      curveSegments: 24,
    });
  }, []);

  return (
    <mesh geometry={geometry} position={[side * 0.02, 0, 0]} rotation={[0, side === 1 ? Math.PI : 0, 0]} castShadow>
      <ABS color={color} roughness={0.3} />
    </mesh>
  );
};

const FacePrint: React.FC = () => (
  <group position={[0, 0, 0.615]}>
    {[-0.22, 0.22].map((x) => (
      <mesh key={x} position={[x, 0.1, 0]}>
        <sphereGeometry args={[0.075, 20, 16]} />
        <meshStandardMaterial color={LEGO_COLORS.black} roughness={0.42} />
      </mesh>
    ))}
    <mesh position={[0, -0.17, 0.01]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[0.19, 0.034, 12, 30, Math.PI]} />
      <meshStandardMaterial color={LEGO_COLORS.black} roughness={0.42} />
    </mesh>
  </group>
);

const armSwing = (frame: number, offset: number) => Math.sin((frame + offset) / 10) * 0.44;

/** One rigid-jointed mechanic. It deliberately has no elbow or knee bending. */
export const MechanicMinifigure: React.FC<MinifigureProps> = ({position = [-9, 0, 3], scale = 1}) => {
  const frame = useCurrentFrame();
  const walking = frame < 1950 || (frame > 9000 && frame < 10800);
  const underCar = frame >= 3750 && frame < 5550;
  const hoisting = frame >= 5550 && frame < 7650;
  const liftingRoof = frame >= 12600 && frame < 14400;
  const seated = frame >= 15300 && frame < 15600;
  const testing = frame >= 16500;
  const stride = walking ? armSwing(frame, 0) : 0;
  const wave = testing ? -1.15 + Math.sin(frame / 9) * 0.25 : 0;
  const roofLift = liftingRoof ? -1.55 : 0;
  const hoistPose = hoisting ? -0.86 : 0;
  const xWalk = interpolate(frame, [0, 750, 18000], [-3.8, 0, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyRotation: V3 = underCar ? [0, 0, Math.PI / 2] : seated ? [0, 0, 0] : [0, 0, 0];
  const seatedDrop = seated ? -0.55 : 0;

  return (
    <group position={[position[0] + xWalk, position[1] + seatedDrop, position[2]]} rotation={bodyRotation} scale={[scale, scale, scale]}>
      {/* Legs and hips */}
      <RoundedPart position={[-0.43, 0.72, 0]} scale={[0.7, 1.36, 0.76]} color={LEGO_COLORS.blue} radius={0.075} />
      <RoundedPart position={[0.43, 0.72, 0]} scale={[0.7, 1.36, 0.76]} color={LEGO_COLORS.blue} radius={0.075} />
      <RoundedPart position={[-0.43, 0.1, 0.14]} scale={[0.78, 0.26, 0.94]} color="#003E8A" radius={0.07} />
      <RoundedPart position={[0.43, 0.1, 0.14]} scale={[0.78, 0.26, 0.94]} color="#003E8A" radius={0.07} />
      <RoundedPart position={[0, 1.46, 0]} scale={[1.55, 0.32, 0.78]} color={LEGO_COLORS.blue} radius={0.07} />

      {/* Tapered torso, printed belt, and chest tag */}
      <mesh position={[0, 2.23, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.91, 1.28, 4, 6]} />
        <ABS color={LEGO_COLORS.red} />
      </mesh>
      <RoundedPart position={[0, 1.78, 0.42]} scale={[1.64, 0.13, 0.075]} color={LEGO_COLORS.black} radius={0.02} />
      <RoundedPart position={[-0.28, 2.4, 0.43]} scale={[0.2, 0.16, 0.04]} color={LEGO_COLORS.white} radius={0.02} />
      <RoundedPart position={[0, 2.9, 0]} scale={[0.62, 0.2, 0.56]} color={LEGO_COLORS.yellow} radius={0.05} />

      {/* Shoulders rotate as complete rigid arm assemblies. */}
      <group position={[-0.88, 2.6, 0]} rotation={[0, 0, 0.42 + stride + hoistPose]}>
        <mesh castShadow>
          <sphereGeometry args={[0.29, 32, 24]} />
          <ABS color={LEGO_COLORS.red} />
        </mesh>
        <RoundedPart position={[0, -0.55, 0]} scale={[0.52, 1.1, 0.62]} color={LEGO_COLORS.red} radius={0.08} />
        <group position={[0, -1.2, 0.02]} rotation={[0, Math.PI / 2, 0]}>
          <CClipHand side={-1} />
        </group>
      </group>
      <group position={[0.88, 2.6, 0]} rotation={[0, 0, -0.42 - stride + wave + roofLift]}>
        <mesh castShadow>
          <sphereGeometry args={[0.29, 32, 24]} />
          <ABS color={LEGO_COLORS.red} />
        </mesh>
        <RoundedPart position={[0, -0.55, 0]} scale={[0.52, 1.1, 0.62]} color={LEGO_COLORS.red} radius={0.08} />
        <group position={[0, -1.2, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
          <CClipHand side={1} />
        </group>
      </group>

      {/* Head, top stud, and a fixed printed face. */}
      <mesh position={[0, 3.66, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.66, 0.69, 1.03, 48]} />
        <ABS color={LEGO_COLORS.yellow} roughness={0.27} />
      </mesh>
      <mesh position={[0, 4.28, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.23, 48]} />
        <ABS color={LEGO_COLORS.yellow} roughness={0.27} />
      </mesh>
      <FacePrint />
    </group>
  );
};
