import {useMemo} from 'react';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const STUD = 1;
export const BRICK_H = 1.2;
export const PLATE_H = 0.4;
export const STUD_R = 0.3;
export const STUD_H = 0.2125;

export const LEGO_COLORS = {
  red: '#C91A09',
  blue: '#0055BF',
  yellow: '#F2CD37',
  black: '#05131D',
  lightGray: '#A0A5A9',
  darkGray: '#6C6E68',
  white: '#FFFFFF',
  orange: '#FE8A18',
  tan: '#E4CD9E',
  darkOrange: '#A95500',
  transClear: '#C9F3FF',
} as const;

export type V3 = [number, number, number];

type ABSProps = {
  color: string;
  roughness?: number;
  transparent?: boolean;
  transmission?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

/** Glossy ABS preset used by every brick and minifigure part. */
export const ABS: React.FC<ABSProps> = ({
  color,
  roughness = 0.3,
  transparent = false,
  transmission = 0,
  emissive = '#000000',
  emissiveIntensity = 0,
}) => (
  <meshPhysicalMaterial
    color={color}
    roughness={roughness}
    metalness={0}
    clearcoat={0.5}
    clearcoatRoughness={0.25}
    ior={1.45}
    transparent={transparent}
    opacity={transparent ? 0.78 : 1}
    transmission={transmission}
    thickness={transparent ? 0.15 : 0}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
  />
);

type RoundedPartProps = {
  position?: V3;
  rotation?: V3;
  scale?: V3;
  color: string;
  radius?: number;
  roughness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  metalness?: number;
  transparent?: boolean;
  transmission?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

/** A unit-sized, bevelled plastic part. Scale it to make custom LEGO-like forms. */
export const RoundedPart: React.FC<RoundedPartProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color,
  radius = 0.04,
  roughness,
  castShadow = true,
  receiveShadow = true,
  transparent,
  transmission,
  emissive,
  emissiveIntensity,
  metalness,
}) => {
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 6, radius), [radius]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      {metalness && metalness > 0 ? (
        <meshPhysicalMaterial
          color={color}
          roughness={roughness ?? 0.35}
          metalness={metalness}
          clearcoat={0.18}
          clearcoatRoughness={0.28}
        />
      ) : (
        <ABS
          color={color}
          roughness={roughness}
          transparent={transparent}
          transmission={transmission}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      )}
    </mesh>
  );
};

export const Stud: React.FC<{color: string; position: V3; glowing?: boolean}> = ({
  color,
  position,
  glowing = false,
}) => (
  <mesh position={position} castShadow receiveShadow>
    <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 48]} />
    <ABS
      color={color}
      roughness={0.26}
      emissive={glowing ? color : '#000000'}
      emissiveIntensity={glowing ? 0.34 : 0}
    />
  </mesh>
);

type LegoBrickProps = {
  w: number;
  d: number;
  h?: number;
  color: string;
  position?: V3;
  rotation?: V3;
  studs?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

/**
 * A LEGO-scale brick. The group's origin is at the bottom center so it can be
 * stacked at integer plate/brick heights without hand-adjusting each child.
 */
export const LegoBrick: React.FC<LegoBrickProps> = ({
  w,
  d,
  h = BRICK_H,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  studs = true,
  castShadow = true,
  receiveShadow = true,
}) => {
  const studPositions = useMemo(() => {
    const result: V3[] = [];
    for (let x = 0; x < w; x += 1) {
      for (let z = 0; z < d; z += 1) {
        result.push([x - (w - 1) / 2, h + STUD_H / 2, z - (d - 1) / 2]);
      }
    }
    return result;
  }, [d, h, w]);

  return (
    <group position={position} rotation={rotation}>
      <RoundedPart
        position={[0, h / 2, 0]}
        scale={[w, h, d]}
        color={color}
        radius={0.04}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
      {studs ? studPositions.map((stud, index) => <Stud key={index} color={color} position={stud} />) : null}
    </group>
  );
};

export const TechnicPin: React.FC<{position: V3; rotation?: V3; color?: string}> = ({
  position,
  rotation = [0, 0, 0],
  color = LEGO_COLORS.black,
}) => (
  <mesh position={position} rotation={rotation} castShadow>
    <cylinderGeometry args={[0.17, 0.17, 0.9, 32]} />
    <ABS color={color} roughness={0.34} />
  </mesh>
);
