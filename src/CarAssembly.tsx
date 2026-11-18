import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {useEffect, useMemo} from 'react';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

type CarAssemblyProps = {
  workshopName: string;
};

type Step = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  start: number;
  end: number;
  accent: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    eyebrow: 'LANGKAH PERTAMA',
    title: 'Siapkan rangka',
    description: 'Letakkan sasis sebagai fondasi mobil.',
    start: 0,
    end: 150,
    accent: '#ffd64d',
  },
  {
    number: '02',
    eyebrow: 'LANGKAH KEDUA',
    title: 'Pasang empat roda',
    description: 'Tekan roda hingga terkunci di setiap poros.',
    start: 150,
    end: 280,
    accent: '#e25242',
  },
  {
    number: '03',
    eyebrow: 'LANGKAH KETIGA',
    title: 'Kunci bodi & kabin',
    description: 'Satukan bodi, kaca, dan kemudi dengan rapi.',
    start: 280,
    end: 410,
    accent: '#63d3c6',
  },
  {
    number: '04',
    eyebrow: 'LANGKAH KEEMPAT',
    title: 'Tambahkan detail',
    description: 'Lampu, atap, lalu mobil siap melaju.',
    start: 410,
    end: 525,
    accent: '#5a90ff',
  },
  {
    number: '✓',
    eyebrow: 'SELESAI DIRAKIT',
    title: 'Mobil siap jalan!',
    description: 'Kerja bagus, sekarang waktunya berpetualang.',
    start: 525,
    end: 600,
    accent: '#ffd64d',
  },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const enter = (frame: number, fps: number, start: number, delay = 0) => {
  return spring({
    frame: Math.max(0, frame - start - delay),
    fps,
    config: {
      damping: 15,
      stiffness: 125,
      mass: 0.65,
    },
  });
};

const fadeIn = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const easeBetween = (
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const RoundedBlock: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color,
  roughness = 0.42,
  metalness = 0.05,
  emissive = '#000000',
  castShadow = true,
  receiveShadow = true,
}) => {
  // A small bevel and more segments keep the toy-brick language, while avoiding
  // the faceted look of the first scene.
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 5, 0.085), []);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive}
        emissiveIntensity={emissive === '#000000' ? 0 : 0.25}
      />
    </mesh>
  );
};

const CameraController: React.FC = () => {
  const frame = useCurrentFrame();
  const {camera} = useThree();

  useEffect(() => {
    const orbit = easeBetween(frame, 0, 600, 0.28, -0.18);
    const finalPush = easeBetween(frame, 520, 600, 0, 0.9);
    camera.position.set(9.1 + orbit, 6.6 - finalPush * 0.35, 13.3 - finalPush);
    camera.lookAt(0, 2.05, 0.15 + finalPush * 0.22);
    camera.updateProjectionMatrix();
  }, [camera, frame]);

  return null;
};

const GarageWindow: React.FC<{position: [number, number, number]; width?: number; height?: number}> = ({
  position,
  width = 2.15,
  height = 1.75,
}) => {
  return (
    <group position={position}>
      <RoundedBlock scale={[width + 0.28, height + 0.28, 0.1]} color="#17242d" roughness={0.35} />
      <RoundedBlock position={[0, 0, 0.065]} scale={[width, height, 0.04]} color="#bfdce1" roughness={0.12} metalness={0.12} />
      <RoundedBlock position={[0, 0, 0.11]} scale={[0.12, height + 0.05, 0.05]} color="#1f2e35" roughness={0.38} />
      <RoundedBlock position={[0, 0, 0.11]} scale={[width + 0.05, 0.12, 0.05]} color="#1f2e35" roughness={0.38} />
    </group>
  );
};

const ToolChest: React.FC<{position: [number, number, number]}> = ({position}) => {
  return (
    <group position={position}>
      <RoundedBlock position={[0, 0.68, 0]} scale={[2.15, 1.22, 0.92]} color="#c73532" roughness={0.28} metalness={0.12} />
      <RoundedBlock position={[0, 1.42, 0]} scale={[2.32, 0.17, 1.05]} color="#e25242" roughness={0.25} metalness={0.1} />
      {[-0.35, 0, 0.35].map((y) => (
        <group key={`drawer-${y}`} position={[0, y + 0.7, 0.48]}>
          <RoundedBlock scale={[1.74, 0.23, 0.045]} color="#a62b30" roughness={0.33} />
          <RoundedBlock position={[0, 0, 0.06]} scale={[0.55, 0.06, 0.035]} color="#e9e8df" roughness={0.28} metalness={0.35} />
        </group>
      ))}
      <mesh position={[-0.74, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.32, 16]} />
        <meshStandardMaterial color="#394b55" roughness={0.42} metalness={0.55} />
      </mesh>
      <mesh position={[0.74, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.32, 16]} />
        <meshStandardMaterial color="#394b55" roughness={0.42} metalness={0.55} />
      </mesh>
    </group>
  );
};

const WorkshopLift: React.FC = () => {
  return (
    <group position={[0, 0, -4.65]}>
      {[-2.65, 2.65].map((x) => (
        <group key={`lift-post-${x}`} position={[x, 0, 0]}>
          <RoundedBlock position={[0, 2.35, 0]} scale={[0.5, 4.7, 0.52]} color="#d64038" roughness={0.3} metalness={0.14} />
          <RoundedBlock position={[0, 0.14, 0.12]} scale={[1.2, 0.18, 1.25]} color="#af2b2e" roughness={0.34} />
          <RoundedBlock position={[0, 2.9, 0.3]} scale={[0.66, 0.68, 0.13]} color="#1b2a33" roughness={0.37} metalness={0.45} />
          <RoundedBlock position={[0, 4.4, 0.3]} scale={[0.27, 0.52, 0.12]} color="#ffd64d" roughness={0.28} emissive="#d59a00" />
        </group>
      ))}
      <RoundedBlock position={[0, 4.66, 0]} scale={[5.55, 0.24, 0.48]} color="#c93432" roughness={0.3} metalness={0.13} />
      <RoundedBlock position={[0, 1.27, 0.48]} scale={[3.85, 0.14, 0.35]} color="#1f2e35" roughness={0.39} metalness={0.5} />
      <RoundedBlock position={[-1.8, 1.16, 0.96]} rotation={[0, 0.1, 0]} scale={[1.45, 0.09, 0.24]} color="#1f2e35" roughness={0.39} metalness={0.48} />
      <RoundedBlock position={[1.8, 1.16, 0.96]} rotation={[0, -0.1, 0]} scale={[1.45, 0.09, 0.24]} color="#1f2e35" roughness={0.39} metalness={0.48} />
    </group>
  );
};

const PartsShelf: React.FC = () => {
  const bottles = [
    [-0.72, 0.43, '#63d3c6'],
    [-0.36, 0.43, '#e25242'],
    [0, 0.43, '#f4b84c'],
    [0.36, 0.43, '#2d6fc7'],
    [0.72, 0.43, '#63d3c6'],
    [-0.65, 1.24, '#f4b84c'],
    [-0.22, 1.24, '#e25242'],
    [0.22, 1.24, '#63d3c6'],
    [0.65, 1.24, '#2d6fc7'],
  ] as const;

  return (
    <group position={[6.45, 0, -5.72]}>
      <RoundedBlock position={[0, 1.45, 0]} scale={[2.45, 0.12, 0.54]} color="#3c4b53" roughness={0.37} metalness={0.36} />
      <RoundedBlock position={[0, 2.25, 0]} scale={[2.45, 0.12, 0.54]} color="#3c4b53" roughness={0.37} metalness={0.36} />
      <RoundedBlock position={[-1.08, 1.14, 0]} scale={[0.12, 2.35, 0.49]} color="#33424a" roughness={0.37} metalness={0.36} />
      <RoundedBlock position={[1.08, 1.14, 0]} scale={[0.12, 2.35, 0.49]} color="#33424a" roughness={0.37} metalness={0.36} />
      {bottles.map(([x, y, color], index) => (
        <group key={`parts-bottle-${index}`} position={[x, y, 0.18]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.16, 0.45, 20]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.27, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            <meshStandardMaterial color="#edf0e7" roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const TireRack: React.FC = () => {
  return (
    <group position={[3.45, 2.5, -6.7]}>
      <RoundedBlock position={[0, -1.05, 0]} scale={[3.3, 0.11, 0.42]} color="#3c4b53" roughness={0.38} metalness={0.37} />
      <RoundedBlock position={[0, 0.95, 0]} scale={[3.3, 0.11, 0.42]} color="#3c4b53" roughness={0.38} metalness={0.37} />
      <RoundedBlock position={[-1.47, 0, 0]} scale={[0.12, 2.2, 0.42]} color="#3c4b53" roughness={0.38} metalness={0.37} />
      <RoundedBlock position={[1.47, 0, 0]} scale={[0.12, 2.2, 0.42]} color="#3c4b53" roughness={0.38} metalness={0.37} />
      {[-1.05, -0.35, 0.35, 1.05].map((x) => (
        <group key={`stored-wheel-${x}`} position={[x, 0, 0.15]}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.34, 0.13, 16, 32]} />
            <meshStandardMaterial color="#202a31" roughness={0.68} />
          </mesh>
          <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.06, 20]} />
            <meshStandardMaterial color="#d5dde0" roughness={0.32} metalness={0.38} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const EngineOnPallet: React.FC = () => {
  return (
    <group position={[5.5, 0, 2.55]} rotation={[0, -0.38, 0]}>
      <RoundedBlock position={[0, 0.12, 0]} scale={[2.0, 0.22, 1.18]} color="#cba665" roughness={0.52} />
      <RoundedBlock position={[0, 0.37, 0]} scale={[1.5, 0.18, 0.82]} color="#856b43" roughness={0.56} />
      <RoundedBlock position={[0, 0.82, 0]} scale={[1.22, 0.72, 0.83]} color="#737d82" roughness={0.34} metalness={0.58} />
      <mesh position={[-0.46, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.23, 0.23, 0.94, 24]} />
        <meshStandardMaterial color="#9ba4a6" roughness={0.28} metalness={0.65} />
      </mesh>
      <mesh position={[0.46, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.23, 0.23, 0.94, 24]} />
        <meshStandardMaterial color="#9ba4a6" roughness={0.28} metalness={0.65} />
      </mesh>
      <mesh position={[0, 0.82, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 28]} />
        <meshStandardMaterial color="#4b565a" roughness={0.29} metalness={0.72} />
      </mesh>
    </group>
  );
};

const Workshop: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + Math.sin(frame / 12) * 0.1;
  const groutRows = [-0.78, -0.39, 0, 0.39, 0.78];

  return (
    <group>
      <color attach="background" args={['#dbe6e8']} />
      <fog attach="fog" args={['#dbe6e8', 17, 34]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
        <planeGeometry args={[34, 34]} />
        <meshStandardMaterial color="#c9d4d7" roughness={0.32} metalness={0.18} />
      </mesh>
      {[-8, -5.3, -2.6, 0, 2.6, 5.3, 8].map((x) => (
        <RoundedBlock key={`floor-seam-x-${x}`} position={[x, 0.002, 0]} scale={[0.025, 0.015, 18]} color="#a7b6ba" roughness={0.75} castShadow={false} />
      ))}
      {[-7.8, -5.1, -2.4, 0.3, 3, 5.7].map((z) => (
        <RoundedBlock key={`floor-seam-z-${z}`} position={[0, 0.002, z]} scale={[18, 0.015, 0.025]} color="#a7b6ba" roughness={0.75} castShadow={false} />
      ))}

      <RoundedBlock position={[0, 4.15, -7.1]} scale={[21, 10.1, 0.2]} color="#e8e8e3" roughness={0.79} />
      {[-0.8, -0.4, 0, 0.4, 0.8].map((row) => (
        <group key={`brick-course-${row}`} position={[0, 4.15 + row * 4.9, -6.97]}>
          {groutRows.map((offset) => (
            <RoundedBlock key={`brick-line-${offset}`} position={[0, offset, 0]} scale={[20.7, 0.022, 0.022]} color="#c5c8c6" roughness={0.9} castShadow={false} />
          ))}
        </group>
      ))}
      {[-5.05, 4.9].flatMap((baseX) =>
        [-0.7, -0.18, 0.34].map((row, rowIndex) =>
          [-0.5, 0.5].map((column) => (
            <RoundedBlock
              key={`brick-accent-${baseX}-${row}-${column}`}
              position={[baseX + column * 0.72 + (rowIndex % 2 ? 0.28 : 0), 4 + row * 1.0, -6.84]}
              scale={[0.64, 0.42, 0.11]}
              color="#b77a52"
              roughness={0.75}
            />
          )),
        ),
      )}

      <GarageWindow position={[-1.9, 4.75, -6.84]} width={2.25} height={1.9} />
      <GarageWindow position={[6.65, 4.75, -6.84]} width={1.7} height={1.9} />
      <RoundedBlock position={[0, 5.87, -6.82]} scale={[2.8, 0.32, 0.12]} color="#233b49" roughness={0.35} />
      <RoundedBlock position={[0, 5.87, -6.69]} scale={[2.28, 0.08, 0.04]} color="#ffd64d" roughness={0.25} emissive="#be8200" />

      <group position={[-7.05, 2.98, -6.75]}>
        <RoundedBlock scale={[2.2, 2.35, 0.1]} color="#9d2d31" roughness={0.35} metalness={0.12} />
        {[-0.68, -0.23, 0.22, 0.67].map((x) => (
          <group key={`tool-${x}`} position={[x, 0.1, 0.12]}>
            <RoundedBlock scale={[0.08, 1.05, 0.05]} color="#232f35" roughness={0.4} metalness={0.48} />
            <mesh position={[0, -0.63, 0.06]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.13, 0.035, 10, 20]} />
              <meshStandardMaterial color="#232f35" roughness={0.35} metalness={0.48} />
            </mesh>
          </group>
        ))}
      </group>
      <ToolChest position={[-6.95, 0, -5.25]} />
      <PartsShelf />
      <TireRack />
      <WorkshopLift />
      <EngineOnPallet />

      <group position={[-4.95, 5.94, -5.45]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 2.2, 24]} />
          <meshStandardMaterial color="#768891" roughness={0.32} metalness={0.58} />
        </mesh>
        <mesh position={[1.1, 0, 0]} castShadow>
          <torusGeometry args={[0.16, 0.055, 12, 24]} />
          <meshStandardMaterial color="#768891" roughness={0.32} metalness={0.58} />
        </mesh>
      </group>
      <RoundedBlock position={[-4.8, 5.84, -5.45]} scale={[0.84, 0.12, 0.65]} color="#56666f" roughness={0.35} metalness={0.48} />

      <RoundedBlock position={[-4.7, 0.06, 3.55]} scale={[3.65, 0.08, 0.5]} color="#687a83" roughness={0.4} metalness={0.38} />
      <RoundedBlock position={[4.95, 0.06, 3.55]} scale={[2.5, 0.08, 0.5]} color="#687a83" roughness={0.4} metalness={0.38} />
      {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
        <RoundedBlock key={`floor-mark-${x}`} position={[x, 0.02, 3.5]} scale={[0.76, 0.025, 0.32]} color="#f5f6ee" roughness={0.75} castShadow={false} />
      ))}

      {[-6.2, 6.2].map((x) => (
        <mesh key={`warning-light-${x}`} position={[x, 5.55, -6.55]}>
          <sphereGeometry args={[0.17, 24, 20]} />
          <meshStandardMaterial color="#ffd64d" emissive="#e6b100" emissiveIntensity={pulse} roughness={0.26} />
        </mesh>
      ))}
    </group>
  );
};

const Wheel: React.FC<{
  frame: number;
  fps: number;
  start: number;
  delay: number;
  position: [number, number, number];
}> = ({frame, fps, start, delay, position}) => {
  const p = enter(frame, fps, start, delay);
  const driving = easeBetween(frame, 530, 600, 0, Math.PI * 2.1);
  const fall = (1 - p) * 4.6;
  const side = position[0] < 0 ? -1 : 1;

  return (
    <group
      position={[position[0] + (1 - p) * side * 0.8, position[1] + fall, position[2]]}
      rotation={[driving, 0, 0]}
      scale={[Math.max(0.01, p), Math.max(0.01, p), Math.max(0.01, p)]}
    >
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.36, 32]} />
        <meshStandardMaterial color="#172637" roughness={0.68} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.52, 0.075, 12, 32]} />
        <meshStandardMaterial color="#101b24" roughness={0.62} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.39, 28]} />
        <meshStandardMaterial color="#f1f4ef" roughness={0.32} metalness={0.25} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 20]} />
        <meshStandardMaterial color="#f3bc42" roughness={0.28} metalness={0.1} />
      </mesh>
    </group>
  );
};

const Car: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chassis = enter(frame, fps, 4);
  const body = enter(frame, fps, 282, 4);
  const cabin = enter(frame, fps, 320, 9);
  const details = enter(frame, fps, 410, 4);
  const finishBounce = spring({
    frame: Math.max(0, frame - 525),
    fps,
    config: {damping: 10, stiffness: 110, mass: 0.7},
  });
  const driving = easeBetween(frame, 530, 600, 0, 0.9);

  return (
    <group position={[0, 0, driving]}>
      <group position={[0, (1 - chassis) * 4.8, 0]} scale={[Math.max(0.01, chassis), Math.max(0.01, chassis), Math.max(0.01, chassis)]}>
        <RoundedBlock position={[0, 0.7, 0]} scale={[2.85, 0.36, 4.45]} color="#1d3445" roughness={0.5} />
        <RoundedBlock position={[0, 0.91, 0]} scale={[2.55, 0.12, 3.76]} color="#f4b84c" roughness={0.32} />
        <RoundedBlock position={[0, 0.43, 0]} scale={[1.46, 0.15, 3.5]} color="#111e29" roughness={0.55} />
      </group>

      <Wheel frame={frame} fps={fps} start={152} delay={0} position={[-1.5, 0.66, 1.48]} />
      <Wheel frame={frame} fps={fps} start={152} delay={8} position={[1.5, 0.66, 1.48]} />
      <Wheel frame={frame} fps={fps} start={152} delay={16} position={[-1.5, 0.66, -1.48]} />
      <Wheel frame={frame} fps={fps} start={152} delay={24} position={[1.5, 0.66, -1.48]} />

      <group position={[0, 1.22 + (1 - body) * 4.4, 0]} scale={[Math.max(0.01, body), Math.max(0.01, body), Math.max(0.01, body)]}>
        <RoundedBlock position={[0, 0, 0]} scale={[2.52, 0.96, 4.12]} color="#e25242" roughness={0.3} />
        <RoundedBlock position={[0, 0.52, 1.23]} scale={[2.42, 0.38, 1.56]} color="#f1644f" roughness={0.25} />
        <RoundedBlock position={[0, 0.25, 2.1]} scale={[2.15, 0.2, 0.16]} color="#183246" roughness={0.4} />
        <RoundedBlock position={[0, 0.45, -2.1]} scale={[2.15, 0.25, 0.16]} color="#f4b84c" roughness={0.28} />
        <RoundedBlock position={[-1.31, 0.05, 0]} scale={[0.15, 0.62, 3.48]} color="#b73837" roughness={0.35} />
        <RoundedBlock position={[1.31, 0.05, 0]} scale={[0.15, 0.62, 3.48]} color="#b73837" roughness={0.35} />
      </group>

      <group position={[0, 2.18 + (1 - cabin) * 3.6, -0.2]} scale={[Math.max(0.01, cabin), Math.max(0.01, cabin), Math.max(0.01, cabin)]}>
        <RoundedBlock position={[0, 0, -0.16]} scale={[2.2, 1.18, 2.16]} color="#f4b84c" roughness={0.28} />
        <RoundedBlock position={[0, 0.02, 0.88]} scale={[1.92, 0.76, 0.08]} color="#a6d7e2" roughness={0.15} metalness={0.08} />
        <RoundedBlock position={[-1.13, 0.02, -0.16]} scale={[0.08, 0.76, 1.55]} color="#a6d7e2" roughness={0.15} />
        <RoundedBlock position={[1.13, 0.02, -0.16]} scale={[0.08, 0.76, 1.55]} color="#a6d7e2" roughness={0.15} />
        <RoundedBlock position={[0, 0.64, -0.16]} scale={[2.34, 0.16, 2.3]} color="#17354f" roughness={0.3} />
        <RoundedBlock position={[0, 0.2, -1.12]} scale={[1.9, 0.62, 0.08]} color="#83c8d7" roughness={0.12} />
        <RoundedBlock position={[-1.17, -0.04, 0.3]} scale={[0.18, 0.22, 0.42]} color="#d9413f" roughness={0.28} />
        <RoundedBlock position={[1.17, -0.04, 0.3]} scale={[0.18, 0.22, 0.42]} color="#d9413f" roughness={0.28} />
        <group position={[0.46, -0.12, 0.45]} rotation={[0, 0, -0.12]}>
          <mesh castShadow>
            <torusGeometry args={[0.28, 0.045, 12, 28]} />
            <meshStandardMaterial color="#233b49" roughness={0.37} metalness={0.38} />
          </mesh>
          <RoundedBlock position={[0, -0.16, 0]} scale={[0.06, 0.29, 0.05]} color="#233b49" roughness={0.37} metalness={0.38} />
        </group>
      </group>

      <group position={[0, 0, (1 - details) * 3.4]} scale={[Math.max(0.01, details), Math.max(0.01, details), Math.max(0.01, details)]}>
        <RoundedBlock position={[-0.82, 1.62, 2.15]} scale={[0.52, 0.28, 0.12]} color="#fff5ba" roughness={0.12} emissive="#ffdc58" />
        <RoundedBlock position={[0.82, 1.62, 2.15]} scale={[0.52, 0.28, 0.12]} color="#fff5ba" roughness={0.12} emissive="#ffdc58" />
        <RoundedBlock position={[0, 1.5, 2.17]} scale={[0.52, 0.16, 0.13]} color="#17354f" roughness={0.44} />
        {[-0.2, 0, 0.2].map((x) => (
          <RoundedBlock key={`grille-slat-${x}`} position={[x, 1.5, 2.25]} scale={[0.055, 0.24, 0.04]} color="#c9d3d5" roughness={0.26} metalness={0.48} />
        ))}
        <RoundedBlock position={[0, 2.86, -0.36]} scale={[1.95, 0.12, 1.94]} color="#f2f4ee" roughness={0.26} />
        <RoundedBlock position={[0, 3.01 + (finishBounce - 1) * 0.14, -0.36]} scale={[1.65, 0.16, 1.62]} color="#ffd64d" roughness={0.3} />
      </group>
    </group>
  );
};

const BlockyBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = enter(frame, fps, 0, 3);
  const gesture = Math.sin(frame / 19) * 0.12;
  const wheelPoint = easeBetween(frame, 148, 260, 0, 1);
  const finalWave = easeBetween(frame, 525, 600, 0, 1);
  const armAngle = -0.52 - wheelPoint * 0.72 + finalWave * 1.25 + gesture;
  const otherArm = 0.42 + Math.sin(frame / 21) * 0.08 - finalWave * 0.5;
  const bob = Math.sin(frame / 24) * 0.035 + (1 - intro) * 2.4;

  return (
    <group position={[-4.35, bob, 1.9]} rotation={[0, 0.22, 0]} scale={[1.08, 1.08, 1.08]}>
      <RoundedBlock position={[-0.42, 0.62, 0]} scale={[0.54, 1.2, 0.62]} color="#2d6fc7" roughness={0.33} />
      <RoundedBlock position={[0.42, 0.62, 0]} scale={[0.54, 1.2, 0.62]} color="#2d6fc7" roughness={0.33} />
      <RoundedBlock position={[-0.42, 0.03, 0.08]} scale={[0.63, 0.28, 0.84]} color="#20559f" roughness={0.32} />
      <RoundedBlock position={[0.42, 0.03, 0.08]} scale={[0.63, 0.28, 0.84]} color="#20559f" roughness={0.32} />
      <RoundedBlock position={[0, 1.7, 0]} scale={[1.38, 1.04, 0.75]} color="#d9413f" roughness={0.3} />
      <RoundedBlock position={[0, 2.27, 0]} scale={[1.14, 0.13, 0.62]} color="#f2f2e9" roughness={0.28} />
      <RoundedBlock position={[0, 2.46, 0]} scale={[0.46, 0.24, 0.45]} color="#f4b84c" roughness={0.3} />

      <group position={[-0.98, 2.02, 0]} rotation={[0, 0, otherArm]}>
        <RoundedBlock position={[0, -0.5, 0]} scale={[0.48, 1.08, 0.55]} color="#d9413f" roughness={0.3} />
        <mesh position={[0, -1.2, 0]} castShadow>
          <sphereGeometry args={[0.33, 20, 16]} />
          <meshStandardMaterial color="#f4b84c" roughness={0.35} />
        </mesh>
      </group>
      <group position={[0.98, 2.02, 0]} rotation={[0, 0, armAngle]}>
        <RoundedBlock position={[0, -0.53, 0]} scale={[0.48, 1.14, 0.55]} color="#d9413f" roughness={0.3} />
        <mesh position={[0, -1.25, 0]} castShadow>
          <sphereGeometry args={[0.34, 20, 16]} />
          <meshStandardMaterial color="#f4b84c" roughness={0.35} />
        </mesh>
      </group>

      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.73, 0.68, 0.98, 16]} />
        <meshStandardMaterial color="#ffd64d" roughness={0.32} />
      </mesh>
      <mesh position={[0, 3.76, 0]} castShadow>
        <cylinderGeometry args={[0.59, 0.63, 0.28, 16]} />
        <meshStandardMaterial color="#f4b84c" roughness={0.3} />
      </mesh>
      <mesh position={[-0.27, 3.28, 0.68]} castShadow>
        <sphereGeometry args={[0.08, 16, 14]} />
        <meshStandardMaterial color="#172637" roughness={0.55} />
      </mesh>
      <mesh position={[0.27, 3.28, 0.68]} castShadow>
        <sphereGeometry args={[0.08, 16, 14]} />
        <meshStandardMaterial color="#172637" roughness={0.55} />
      </mesh>
      <RoundedBlock position={[0, 3.0, 0.69]} scale={[0.38, 0.07, 0.05]} color="#172637" roughness={0.62} />
    </group>
  );
};

const Scene: React.FC = () => {
  return (
    <>
      <CameraController />
      <ambientLight intensity={1.2} color="#eafcff" />
      <hemisphereLight args={['#dff6ff', '#5b6771', 1.55]} />
      <directionalLight
        position={[4.5, 9, 5]}
        intensity={3.2}
        color="#fff2c7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 4, 1]} intensity={1.2} color="#86cbea" />
      <Workshop />
      <Car />
      <BlockyBuilder />
    </>
  );
};

const TutorialOverlay: React.FC<{workshopName: string}> = ({workshopName}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const currentStep = STEPS.find((step) => frame >= step.start && frame < step.end) ?? STEPS[STEPS.length - 1];
  const entrance = fadeIn(frame, currentStep.start, 10);
  const titleProgress = clamp01((frame - currentStep.start) / 18);
  const overall = clamp01(frame / (durationInFrames - 1));
  const endCard = fadeIn(frame, 525, 12);

  return (
    <AbsoluteFill style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#17354f', pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 64, left: 72, display: 'flex', alignItems: 'center', gap: 14, opacity: fadeIn(frame, 0, 12)}}>
        <div style={{width: 18, height: 18, borderRadius: 5, background: '#ffd64d', boxShadow: '0 0 0 6px rgba(255,214,77,0.22)'}} />
        <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 3.5, color: '#17354f'}}>{workshopName}</div>
      </div>

      <div style={{position: 'absolute', top: 105, left: 72, width: 600, opacity: fadeIn(frame, 0, 16)}}>
        <div style={{fontSize: 66, fontWeight: 900, lineHeight: 0.96, letterSpacing: -3.4}}>MERAKIT</div>
        <div style={{fontSize: 66, fontWeight: 900, lineHeight: 0.96, letterSpacing: -3.4, color: '#e25242'}}>MOBIL MINI</div>
        <div style={{height: 4, width: 145, background: '#ffd64d', marginTop: 22, borderRadius: 999}} />
      </div>

      <div style={{position: 'absolute', top: 56, right: 70, width: 260, opacity: fadeIn(frame, 0, 16)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10}}>
          <span style={{fontWeight: 800, fontSize: 13, letterSpacing: 1.8}}>PROGRES RAKIT</span>
          <span style={{fontWeight: 900, fontSize: 20}}>{Math.round(overall * 100)}%</span>
        </div>
        <div style={{height: 10, borderRadius: 99, background: 'rgba(23,53,79,0.16)', overflow: 'hidden', border: '1px solid rgba(23,53,79,0.08)'}}>
          <div style={{height: '100%', width: `${overall * 100}%`, borderRadius: 99, background: 'linear-gradient(90deg, #ffd64d, #e25242)', boxShadow: '0 2px 8px rgba(226,82,66,0.4)'}} />
        </div>
      </div>

      <div style={{position: 'absolute', right: 70, bottom: 80, width: 432, transform: `translateY(${(1 - entrance) * 34}px)`, opacity: entrance}}>
        <div style={{background: 'rgba(255,255,255,0.92)', border: `2px solid ${currentStep.accent}`, borderRadius: 26, boxShadow: '0 18px 46px rgba(23,53,79,0.19)', padding: '25px 28px 27px', backdropFilter: 'blur(12px)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
            <div style={{width: 46, height: 46, display: 'grid', placeItems: 'center', borderRadius: 14, background: currentStep.accent, color: '#17354f', fontSize: 21, fontWeight: 950, boxShadow: 'inset 0 -3px 0 rgba(23,53,79,0.14)'}}>{currentStep.number}</div>
            <div style={{fontSize: 13, letterSpacing: 2.2, fontWeight: 900, color: '#64808e'}}>{currentStep.eyebrow}</div>
          </div>
          <div style={{fontSize: 35, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.45, marginTop: 19, transform: `translateX(${(1 - titleProgress) * 12}px)`}}>{currentStep.title}</div>
          <div style={{fontSize: 18, lineHeight: 1.45, color: '#517080', fontWeight: 600, marginTop: 9, maxWidth: 330}}>{currentStep.description}</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 72, bottom: 63, opacity: fadeIn(frame, 0, 20), display: 'flex', gap: 10, alignItems: 'center'}}>
        {STEPS.slice(0, 4).map((step) => {
          const active = frame >= step.start && frame < step.end;
          const completed = frame >= step.end;
          return (
            <div key={step.number} style={{height: 9, width: active ? 64 : 28, borderRadius: 999, background: active || completed ? step.accent : 'rgba(23,53,79,0.18)', transition: 'none'}} />
          );
        })}
        <span style={{fontSize: 14, fontWeight: 900, letterSpacing: 1.4, marginLeft: 7, color: '#64808e'}}>TUTORIAL MINI</span>
      </div>

      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 49% 47%, transparent 47%, rgba(16,40,57,0.11) 100%)', opacity: 0.6}} />
      <div style={{position: 'absolute', inset: 0, opacity: endCard * 0.95, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{marginTop: -330, background: '#17354f', color: '#fff', padding: '11px 20px 12px', borderRadius: 999, boxShadow: '0 10px 30px rgba(23,53,79,0.24)', fontWeight: 900, fontSize: 17, letterSpacing: 2.2}}>SIAP UNTUK PETUALANGAN</div>
      </div>
    </AbsoluteFill>
  );
};

export const CarAssembly: React.FC<CarAssemblyProps> = ({workshopName}) => {
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#e7eef1'}}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        dpr={1}
        gl={{antialias: true, preserveDrawingBuffer: true}}
        camera={{fov: 37, near: 0.1, far: 80, position: [9.1, 6.6, 13.3]}}
      >
        <Scene />
      </ThreeCanvas>
      <TutorialOverlay workshopName={workshopName} />
    </AbsoluteFill>
  );
};
