import {interpolate, useCurrentFrame} from 'remotion';
import {ABS, LEGO_COLORS, RoundedPart, type V3} from '../lego/Brick';

const Metal: React.FC<{color?: string; roughness?: number}> = ({color = '#89959A', roughness = 0.34}) => (
  <meshPhysicalMaterial color={color} metalness={0.88} roughness={roughness} clearcoat={0.14} />
);

const Window: React.FC<{position: V3; width: number; height: number}> = ({position, width, height}) => (
  <group position={position}>
    <RoundedPart scale={[width + 0.36, height + 0.36, 0.2]} color={LEGO_COLORS.black} radius={0.04} />
    <RoundedPart position={[0, 0, 0.12]} scale={[width, height, 0.05]} color="#BDE9F4" radius={0.02} transparent transmission={1} />
    <RoundedPart position={[0, 0, 0.17]} scale={[0.15, height + 0.1, 0.08]} color={LEGO_COLORS.black} radius={0.02} />
    <RoundedPart position={[0, 0, 0.17]} scale={[width + 0.1, 0.15, 0.08]} color={LEGO_COLORS.black} radius={0.02} />
  </group>
);

const WallClock: React.FC = () => {
  const frame = useCurrentFrame();
  const minuteRotation = (frame / 30 / 60) * Math.PI * 2;
  return (
    <group position={[8.1, 12.2, -15.65]}>
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 0.14, 48]} />
        <ABS color={LEGO_COLORS.white} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.1]} rotation={[0, 0, -minuteRotation]}>
        <boxGeometry args={[0.07, 0.68, 0.05]} />
        <meshStandardMaterial color={LEGO_COLORS.black} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial color={LEGO_COLORS.red} />
      </mesh>
    </group>
  );
};

const ToolChest: React.FC = () => (
  <group position={[-12.2, 0, -11.7]}>
    <RoundedPart position={[0, 1.55, 0]} scale={[5.1, 3.0, 2.0]} color={LEGO_COLORS.red} radius={0.08} />
    <RoundedPart position={[0, 3.2, 0]} scale={[5.45, 0.3, 2.22]} color="#E64A3F" radius={0.06} />
    {[-0.76, 0, 0.76].map((y) => (
      <group key={y} position={[0, 1.55 + y, 1.04]}>
        <RoundedPart scale={[4.25, 0.42, 0.07]} color="#A71915" radius={0.02} />
        <RoundedPart position={[0, 0, 0.08]} scale={[1.05, 0.1, 0.035]} color="#E7EBEC" radius={0.01} metalness={0.58} />
      </group>
    ))}
    {[-1.8, 1.8].map((x) => (
      <mesh key={x} position={[x, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.32, 28]} />
        <meshStandardMaterial color="#34444C" roughness={0.48} />
      </mesh>
    ))}
  </group>
);

const Pegboard: React.FC = () => (
  <group position={[-12.1, 8.25, -15.65]}>
    <RoundedPart scale={[5.5, 5.2, 0.14]} color="#9C2A29" radius={0.04} />
    {[-1.85, -0.95, -0.05, 0.85, 1.75].map((x, index) => (
      <group key={x} position={[x, index % 2 ? -0.35 : 0.35, 0.15]}>
        <RoundedPart scale={[0.13, 2.2, 0.08]} color="#263238" radius={0.02} metalness={0.72} />
        <mesh position={[0, -1.3, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25, 0.055, 12, 24]} />
          <Metal color="#263238" />
        </mesh>
      </group>
    ))}
  </group>
);

const PartsShelf: React.FC = () => {
  const bottles = [
    [-1.25, 1.45, '#3EA36D'], [-0.65, 1.45, LEGO_COLORS.red], [-0.05, 1.45, '#9EA7AA'], [0.55, 1.45, '#3EA36D'], [1.15, 1.45, LEGO_COLORS.red],
    [-1.1, 3.1, '#3EA36D'], [-0.45, 3.1, LEGO_COLORS.red], [0.2, 3.1, '#9EA7AA'], [0.85, 3.1, '#3EA36D'],
  ] as const;
  return (
    <group position={[12.2, 0, -14.55]}>
      {[-1.45, 1.45].map((x) => <RoundedPart key={x} position={[x, 2.5, 0]} scale={[0.18, 5.0, 1.25]} color="#3D4B50" radius={0.03} metalness={0.7} />)}
      {[0.55, 2.25, 3.95].map((y) => <RoundedPart key={y} position={[0, y, 0]} scale={[3.3, 0.16, 1.32]} color="#3D4B50" radius={0.025} metalness={0.7} />)}
      {bottles.map(([x, y, color], index) => (
        <group key={index} position={[x, y, 0.35]}>
          <mesh castShadow><cylinderGeometry args={[0.24, 0.27, 0.78, 28]} /><ABS color={color} /></mesh>
          <mesh position={[0, 0.44, 0]}><cylinderGeometry args={[0.13, 0.13, 0.12, 20]} /><ABS color={LEGO_COLORS.white} /></mesh>
        </group>
      ))}
    </group>
  );
};

const GasRack: React.FC = () => (
  <group position={[13.2, 0, -8.0]}>
    <RoundedPart position={[0, 0.2, 0]} scale={[4.2, 0.3, 1.6]} color="#57666C" radius={0.04} metalness={0.63} />
    {[-1.35, -0.45, 0.45, 1.35].map((x, index) => (
      <group key={x} position={[x, 1.5, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.45, 0.52, 2.75, 32]} /><ABS color={index % 3 === 0 ? '#379866' : index % 3 === 1 ? LEGO_COLORS.red : '#879399'} /></mesh>
        <mesh position={[0, 1.47, 0]}><cylinderGeometry args={[0.16, 0.16, 0.25, 24]} /><Metal /></mesh>
      </group>
    ))}
  </group>
);

const TwoPostLift: React.FC = () => {
  const frame = useCurrentFrame();
  const liftGlow = frame < 90 ? 0.2 + (frame % 20 < 8 ? 0.8 : 0) : 0.22;
  return (
    <group position={[0, 0, -0.5]}>
      {[-6.1, 6.1].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <RoundedPart position={[0, 7.2, 0]} scale={[1.05, 14.4, 1.0]} color={LEGO_COLORS.red} radius={0.08} />
          <RoundedPart position={[0, 0.2, 0.35]} scale={[2.25, 0.35, 2.25]} color="#A71915" radius={0.05} />
          <RoundedPart position={[0, 8.0, 0.58]} scale={[1.35, 1.65, 0.22]} color={LEGO_COLORS.black} radius={0.04} metalness={0.5} />
          <mesh position={[0, 12.5, 0.6]}><sphereGeometry args={[0.22, 28, 20]} /><meshStandardMaterial color={LEGO_COLORS.yellow} emissive="#E9B900" emissiveIntensity={liftGlow} /></mesh>
        </group>
      ))}
      <RoundedPart position={[0, 14.25, 0]} scale={[13.2, 0.52, 1.0]} color={LEGO_COLORS.red} radius={0.07} />
      <RoundedPart position={[0, 2.72, 0.85]} scale={[10.0, 0.24, 0.68]} color="#202C31" radius={0.04} metalness={0.72} />
      {[-4.35, 4.35].map((x) => <RoundedPart key={x} position={[x, 2.52, 2.2]} rotation={[0, x < 0 ? 0.12 : -0.12, 0]} scale={[3.45, 0.18, 0.5]} color="#202C31" radius={0.035} metalness={0.72} />)}
    </group>
  );
};

const EnginePallet: React.FC = () => (
  <group position={[10.2, 0, 8.1]} rotation={[0, -0.28, 0]}>
    {[-1.0, 0, 1.0].map((x) => <RoundedPart key={x} position={[x, 0.2, 0]} scale={[0.55, 0.4, 3.7]} color={LEGO_COLORS.tan} radius={0.035} roughness={0.67} />)}
    <RoundedPart position={[0, 0.55, 0]} scale={[3.8, 0.22, 2.9]} color="#B0925A" radius={0.035} roughness={0.62} />
    <RoundedPart position={[0, 1.4, 0]} scale={[2.7, 1.35, 2.5]} color="#737E82" radius={0.09} metalness={0.6} />
    {[-0.92, 0.92].map((x) => <mesh key={x} position={[x, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.38, 0.38, 1.9, 32]} /><Metal color="#AFB7BA" /></mesh>)}
  </group>
);

const EngineHoist: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [5550, 6450, 7300, 7650], [9.4, 2.4, 0.5, 9.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chainY = interpolate(frame, [5700, 6450, 7200], [5.6, 8.2, 5.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <group position={[x, 0, 4.8]}>
      <RoundedPart position={[0, 0.3, 0]} scale={[4.5, 0.3, 2.3]} color={LEGO_COLORS.red} radius={0.05} />
      <RoundedPart position={[0, 5.2, 0]} scale={[0.56, 10.4, 0.62]} color={LEGO_COLORS.red} radius={0.07} />
      <RoundedPart position={[-1.85, 9.8, 0]} rotation={[0, 0, -0.26]} scale={[4.1, 0.38, 0.48]} color={LEGO_COLORS.red} radius={0.06} />
      <mesh position={[-3.38, chainY, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, Math.max(0.2, 10.1 - chainY), 16]} /><Metal color="#566469" /></mesh>
      <mesh position={[-3.38, chainY - (10.1 - chainY) / 2, 0]} castShadow><torusGeometry args={[0.22, 0.05, 12, 24]} /><Metal color="#566469" /></mesh>
      {[-1.7, 1.7].map((wheelX) => <mesh key={wheelX} position={[wheelX, 0.15, 0.72]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.28, 0.28, 0.18, 24]} /><meshStandardMaterial color="#1A1A1A" roughness={0.82} /></mesh>)}
    </group>
  );
};

const UtilityProps: React.FC = () => (
  <>
    <group position={[-10.8, 0, 8.0]}>
      <RoundedPart position={[0, 0.22, 0]} scale={[3.2, 0.25, 1.75]} color={LEGO_COLORS.red} radius={0.04} />
      <RoundedPart position={[0, 0.48, 0]} scale={[0.65, 0.18, 1.3]} color="#A71915" radius={0.03} />
      {[-1.1, 1.1].map((x) => <mesh key={x} position={[x, 0.12, 0.62]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.23, 0.23, 0.15, 20]} /><meshStandardMaterial color="#1A1A1A" roughness={0.85} /></mesh>)}
    </group>
    <group position={[-8.0, 0, 9.7]}>
      <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.8, 0.8, 2.3, 32]} /><ABS color={LEGO_COLORS.black} roughness={0.5} /></mesh>
      <mesh position={[0, 2.4, 0]}><cylinderGeometry args={[0.98, 0.98, 0.16, 32]} /><ABS color={LEGO_COLORS.black} /></mesh>
    </group>
    <group position={[13.1, 0, 5.0]}>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.85, 0.85, 1.4, 32]} /><ABS color="#6C6E68" roughness={0.48} /></mesh>
      <RoundedPart position={[0, 1.6, 0]} scale={[1.45, 0.18, 1.45]} color="#566469" radius={0.03} metalness={0.55} />
    </group>
  </>
);

const HazardStrip: React.FC = () => (
  <group position={[0, 0.035, 2.0]}>
    <RoundedPart scale={[11.0, 0.04, 0.55]} color={LEGO_COLORS.yellow} radius={0.01} castShadow={false} />
    {[-4.5, -3, -1.5, 0, 1.5, 3, 4.5].map((x) => <RoundedPart key={x} position={[x, 0.025, 0]} rotation={[0, 0.65, 0]} scale={[0.55, 0.06, 0.78]} color={LEGO_COLORS.black} radius={0.01} castShadow={false} />)}
  </group>
);

const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  const particles: readonly V3[] = [[-2, 9, -8], [-0.5, 7, -6], [1.1, 11, -10], [3, 6, -7], [4.2, 9.5, -9], [-3.5, 5.2, -9], [5.5, 8.4, -8], [-0.8, 12, -10]];
  return (
    <group>
      {particles.map((particle, index) => (
        <mesh key={index} position={[particle[0] + Math.sin((frame + index * 18) / 90) * 0.16, particle[1] + (frame % 180) / 180 * 0.22, particle[2]]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshBasicMaterial color="#FFF8D5" transparent opacity={0.28} />
        </mesh>
      ))}
    </group>
  );
};

/** Cutaway workshop based on the user's supplied garage MOC reference. */
export const Garage: React.FC = () => {
  return (
    <group>
      <color attach="background" args={['#CBD6D8']} />
      <fog attach="fog" args={['#CBD6D8', 33, 70]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[54, 54]} />
        <meshPhysicalMaterial color="#D2D9DA" roughness={0.2} metalness={0.06} clearcoat={1} clearcoatRoughness={0.2} />
      </mesh>
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((x) => <RoundedPart key={`tilex-${x}`} position={[x, 0, 0]} scale={[0.04, 0.018, 52]} color="#9FAEB1" radius={0.01} castShadow={false} />)}
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((z) => <RoundedPart key={`tilez-${z}`} position={[0, 0, z]} scale={[52, 0.018, 0.04]} color="#9FAEB1" radius={0.01} castShadow={false} />)}

      {/* Back and left cutaway walls */}
      <RoundedPart position={[0, 8, -16]} scale={[32, 16, 0.35]} color="#F2F2EC" radius={0.04} roughness={0.58} />
      <RoundedPart position={[-16, 8, 0]} rotation={[0, Math.PI / 2, 0]} scale={[32, 16, 0.35]} color="#F2F2EC" radius={0.04} roughness={0.58} />
      {[-13, -11.5, -10, -8.5, -7].flatMap((x) => [3.3, 5.1, 6.9].map((y) => [x, y] as const)).map(([x, y], index) => (
        <RoundedPart key={index} position={[x, y, -15.75]} scale={[1.35, 0.75, 0.09]} color={LEGO_COLORS.darkOrange} radius={0.02} roughness={0.64} />
      ))}
      <RoundedPart position={[0, 0.55, -15.65]} scale={[31.6, 0.6, 0.36]} color={LEGO_COLORS.black} radius={0.02} />
      <Window position={[-2.4, 10.2, -15.7]} width={5.4} height={4.4} />
      <Window position={[12.1, 10.2, -15.7]} width={3.5} height={4.4} />
      <WallClock />
      <RoundedPart position={[-11.6, 13.1, -15.68]} scale={[3.5, 1.2, 0.25]} color="#75858B" radius={0.05} metalness={0.42} />
      {[-12.5, -11.6, -10.7].map((x) => <mesh key={x} position={[x, 13.1, -15.5]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.18, 0.05, 12, 24]} /><Metal color="#38474C" /></mesh>)}

      <ToolChest />
      <Pegboard />
      <PartsShelf />
      <GasRack />
      <TwoPostLift />
      <EnginePallet />
      <EngineHoist />
      <UtilityProps />
      <HazardStrip />
      <Dust />

      {/* Dark grating exactly below the lift. */}
      <group position={[0, 0.03, -2.2]}>
        {[-4.5, -3.6, -2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6, 4.5].map((x) => <RoundedPart key={x} position={[x, 0, 0]} scale={[0.12, 0.05, 8.2]} color="#3B474C" radius={0.01} castShadow={false} />)}
      </group>
    </group>
  );
};
