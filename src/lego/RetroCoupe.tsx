import {interpolate, useCurrentFrame} from 'remotion';
import {ABS, LEGO_COLORS, LegoBrick, RoundedPart, Stud, TechnicPin, type V3} from './Brick';
import {snapIn, visibleAfter} from './snapIn';

const MODULE = {
  chassis: 1950,
  axles: 3750,
  shocks: 4070,
  steering: 5140,
  engine: 6300,
  drivetrain: 7650,
  tank: 8560,
  exhaust: 8240,
  wheels: 9000,
  floor: 10800,
  panels: 11500,
  fenders: 12600,
  hood: 13050,
  roof: 13800,
  interior: 14400,
  details: 15600,
} as const;

type AssembleProps = {start: number; position?: V3; lift?: number; children: React.ReactNode};

const Assemble: React.FC<AssembleProps> = ({start, position = [0, 0, 0], lift = 2.4, children}) => {
  const frame = useCurrentFrame();
  const a = snapIn(frame, start, 14, lift);
  const visible = visibleAfter(frame, start);
  return (
    <group
      position={[position[0], position[1] + a.lift + a.press, position[2]]}
      scale={[a.scale * visible, a.scale * visible, a.scale * visible]}
    >
      {children}
    </group>
  );
};

const CarWheel: React.FC<{x: number; z: number; start: number; delay: number}> = ({x, z, start, delay}) => {
  const frame = useCurrentFrame();
  const progress = visibleAfter(frame, start + delay);
  const rolling = interpolate(frame, [17400, 17700], [0, Math.PI * 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <group position={[x, 1.3 + (1 - progress) * 3.4, z]} rotation={[rolling, 0, 0]} scale={[progress, progress, progress]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.78, 48]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.85} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[1.28, 0.12, 20, 48]} />
        <meshStandardMaterial color="#101010" roughness={0.86} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.84, 40]} />
        <meshPhysicalMaterial color="#D7DDE0" roughness={0.27} metalness={0.62} clearcoat={0.22} />
      </mesh>
      {[[0.36, 0], [-0.36, 0], [0, 0.36], [0, -0.36]].map(([nx, ny], index) => (
        <mesh key={index} position={[x < 0 ? -0.44 : 0.44, nx, ny]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 24]} />
          <meshStandardMaterial color={LEGO_COLORS.black} roughness={0.45} metalness={0.48} />
        </mesh>
      ))}
    </group>
  );
};

const V8Engine: React.FC = () => (
  <group>
    <RoundedPart position={[0, 0.8, 0]} scale={[3.2, 1.25, 3.4]} color={LEGO_COLORS.darkGray} radius={0.08} metalness={0.45} />
    {[-1.1, 1.1].map((x) => (
      <group key={x} position={[x, 1.72, 0]} rotation={[0, 0, x < 0 ? -0.2 : 0.2]}>
        <RoundedPart scale={[0.92, 0.5, 2.9]} color="#8A9498" radius={0.07} metalness={0.58} />
        {[-0.75, 0, 0.75].map((z) => (
          <mesh key={z} position={[0, 0.34, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.38, 32]} />
            <meshPhysicalMaterial color="#BAC1C4" roughness={0.26} metalness={0.72} />
          </mesh>
        ))}
      </group>
    ))}
    <mesh position={[0, 2.05, 0]} castShadow>
      <cylinderGeometry args={[0.72, 0.72, 0.38, 40]} />
      <ABS color={LEGO_COLORS.black} roughness={0.28} />
    </mesh>
    <mesh position={[0, 2.27, 0]} castShadow>
      <cylinderGeometry args={[0.62, 0.62, 0.12, 40]} />
      <ABS color={LEGO_COLORS.orange} roughness={0.26} />
    </mesh>
  </group>
);

const EngineBay: React.FC = () => (
  <group>
    <V8Engine />
    <RoundedPart position={[0, 1.2, 2.45]} scale={[5.3, 1.15, 0.45]} color={LEGO_COLORS.lightGray} radius={0.05} metalness={0.25} />
    {[-1.8, 1.8].map((x) => (
      <mesh key={x} position={[x, 1.78, 2.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.26, 0.07, 14, 28]} />
        <meshStandardMaterial color="#253239" roughness={0.5} metalness={0.35} />
      </mesh>
    ))}
  </group>
);

const Headlight: React.FC<{x: number; lit: boolean}> = ({x, lit}) => (
  <group position={[x, 2.85, 10.92]}>
    <RoundedPart scale={[1.15, 0.58, 0.18]} color={LEGO_COLORS.transClear} radius={0.04} transparent transmission={1} />
    <mesh position={[0, 0, 0.12]}>
      <sphereGeometry args={[0.28, 32, 24]} />
      <meshPhysicalMaterial color="#FFF4B0" emissive="#FFE15A" emissiveIntensity={lit ? 2.2 : 0.1} roughness={0.1} />
    </mesh>
  </group>
);

/** Orange 8x22 retro coupe, assembled in the 16 modules from the script. */
export const RetroCoupe: React.FC = () => {
  const frame = useCurrentFrame();
  const liftedY = interpolate(frame, [1950, 9000, 10560], [2.65, 2.65, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driveOut = interpolate(frame, [17400, 17720], [0, 29], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lightsOn = frame >= 16580;
  const hoodOpen = interpolate(frame, [13050, 13360, 13600], [0, -0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wiper = lightsOn ? Math.sin((frame - 16500) / 9) * 0.35 : 0;

  return (
    <group position={[0, liftedY, driveOut]}>
      {/* 1. Chassis */}
      <Assemble start={MODULE.chassis} lift={3.4}>
        <RoundedPart position={[-3.25, 1.58, 0]} scale={[0.52, 0.56, 21.8]} color={LEGO_COLORS.black} radius={0.05} />
        <RoundedPart position={[3.25, 1.58, 0]} scale={[0.52, 0.56, 21.8]} color={LEGO_COLORS.black} radius={0.05} />
        {[-7.4, -3.7, 0, 3.7, 7.4].map((z) => (
          <LegoBrick key={z} w={7} d={1} h={0.4} color={LEGO_COLORS.darkGray} position={[0, 1.56, z]} studs={false} />
        ))}
        <RoundedPart position={[0, 1.15, 0]} scale={[7.55, 0.28, 22]} color={LEGO_COLORS.lightGray} radius={0.04} />
      </Assemble>

      {/* 2, 3, 4. Axles, shocks and steering rack */}
      <Assemble start={MODULE.axles} lift={2.3}>
        {[-7.45, 7.45].map((z) => (
          <group key={z} position={[0, 1.38, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 8.6, 40]} />
              <meshStandardMaterial color="#3B464C" roughness={0.32} metalness={0.75} />
            </mesh>
            <TechnicPin position={[-4.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
            <TechnicPin position={[4.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
          </group>
        ))}
      </Assemble>
      <Assemble start={MODULE.shocks} lift={2}>
        {[-3.2, 3.2].flatMap((x) => [-7.25, 7.25].map((z) => [x, z] as const)).map(([x, z]) => (
          <group key={`${x}-${z}`} position={[x, 2.15, z]} rotation={[0.22, 0, x < 0 ? 0.18 : -0.18]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 1.25, 32]} />
              <meshStandardMaterial color="#BEC4C5" roughness={0.32} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <torusGeometry args={[0.27, 0.05, 12, 28]} />
              <meshStandardMaterial color={LEGO_COLORS.red} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </Assemble>
      <Assemble start={MODULE.steering} lift={1.7}>
        <RoundedPart position={[0, 1.92, 6.1]} scale={[3.8, 0.26, 0.48]} color={LEGO_COLORS.darkGray} radius={0.035} metalness={0.42} />
        <mesh position={[0, 2.3, 5.3]} rotation={[0.48, 0, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 2.45, 32]} />
          <meshStandardMaterial color="#253239" roughness={0.35} metalness={0.55} />
        </mesh>
      </Assemble>

      {/* 5. V8 engine */}
      <Assemble start={MODULE.engine} position={[0, 1.82, 3.5]} lift={5.1}>
        <EngineBay />
      </Assemble>

      {/* 6, 7, 8. Drivetrain, tank/battery, exhaust */}
      <Assemble start={MODULE.drivetrain} lift={2.4}>
        <mesh position={[0, 1.4, -2.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 10.6, 36]} />
          <meshStandardMaterial color="#59666B" roughness={0.28} metalness={0.72} />
        </mesh>
        <RoundedPart position={[0, 1.45, -6.7]} scale={[2.4, 0.75, 1.15]} color={LEGO_COLORS.darkGray} radius={0.06} metalness={0.48} />
      </Assemble>
      <Assemble start={MODULE.tank} lift={1.8}>
        <RoundedPart position={[-2.3, 1.72, -7.2]} scale={[1.35, 0.72, 2.35]} color={LEGO_COLORS.lightGray} radius={0.07} metalness={0.38} />
        <RoundedPart position={[2.35, 1.76, -7.2]} scale={[1.25, 0.68, 1.65]} color={LEGO_COLORS.black} radius={0.06} />
      </Assemble>
      <Assemble start={MODULE.exhaust} lift={2.1}>
        {[-1.9, 1.9].map((x) => (
          <group key={x}>
            <mesh position={[x, 1.1, -2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 14.5, 32]} />
              <meshStandardMaterial color="#9BA5A8" roughness={0.28} metalness={0.8} />
            </mesh>
            <mesh position={[x, 1.1, -10.0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.23, 0.2, 0.85, 32]} />
              <meshStandardMaterial color="#45545A" roughness={0.36} metalness={0.72} />
            </mesh>
          </group>
        ))}
      </Assemble>

      {/* 9. Wheels */}
      <CarWheel x={-4.2} z={7.45} start={MODULE.wheels} delay={0} />
      <CarWheel x={4.2} z={7.45} start={MODULE.wheels} delay={85} />
      <CarWheel x={-4.2} z={-7.45} start={MODULE.wheels} delay={170} />
      <CarWheel x={4.2} z={-7.45} start={MODULE.wheels} delay={255} />

      {/* 10, 11. Floor and side panels */}
      <Assemble start={MODULE.floor} lift={2.8}>
        <RoundedPart position={[0, 2.25, 0]} scale={[7.85, 0.34, 21.2]} color={LEGO_COLORS.lightGray} radius={0.045} />
        <RoundedPart position={[0, 3.05, -4.2]} scale={[7.55, 1.25, 0.28]} color={LEGO_COLORS.darkGray} radius={0.04} />
      </Assemble>
      <Assemble start={MODULE.panels} lift={3}>
        <RoundedPart position={[-3.88, 3.25, -0.4]} scale={[0.48, 2.05, 14.7]} color={LEGO_COLORS.orange} radius={0.07} />
        <RoundedPart position={[3.88, 3.25, -0.4]} scale={[0.48, 2.05, 14.7]} color={LEGO_COLORS.orange} radius={0.07} />
        <RoundedPart position={[0, 3.1, -7.7]} scale={[7.7, 1.4, 4.8]} color={LEGO_COLORS.orange} radius={0.08} />
      </Assemble>

      {/* 12, 13. Fenders, hood and trunk */}
      <Assemble start={MODULE.fenders} lift={2.6}>
        {[-4.2, 4.2].flatMap((x) => [-7.45, 7.45].map((z) => [x, z] as const)).map(([x, z]) => (
          <RoundedPart key={`${x}-${z}`} position={[x * 0.93, 3.0, z]} scale={[1.15, 0.5, 3.25]} color={LEGO_COLORS.orange} radius={0.11} />
        ))}
      </Assemble>
      <Assemble start={MODULE.hood} lift={2.4}>
        <group position={[0, 3.8, 6.85]} rotation={[hoodOpen, 0, 0]}>
          <RoundedPart position={[0, 0, 2.0]} scale={[7.55, 0.38, 7.2]} color={LEGO_COLORS.orange} radius={0.08} />
          <RoundedPart position={[0, 0.22, 2.0]} scale={[1.32, 0.08, 6.7]} color={LEGO_COLORS.white} radius={0.02} />
        </group>
        <RoundedPart position={[0, 3.7, -9.0]} scale={[7.45, 0.42, 3.8]} color={LEGO_COLORS.orange} radius={0.08} />
      </Assemble>

      {/* 14. Cabin, roof and transparent windows */}
      <Assemble start={MODULE.roof} lift={3.6}>
        <RoundedPart position={[-3.1, 4.95, -1.6]} scale={[0.38, 3.25, 6.4]} color={LEGO_COLORS.orange} radius={0.06} />
        <RoundedPart position={[3.1, 4.95, -1.6]} scale={[0.38, 3.25, 6.4]} color={LEGO_COLORS.orange} radius={0.06} />
        <RoundedPart position={[0, 6.5, -1.6]} scale={[6.6, 0.45, 6.7]} color={LEGO_COLORS.orange} radius={0.08} />
        <RoundedPart position={[0, 6.77, -1.6]} scale={[1.2, 0.08, 6.0]} color={LEGO_COLORS.white} radius={0.02} />
        <RoundedPart position={[0, 4.95, 1.65]} rotation={[-0.2, 0, 0]} scale={[5.75, 2.5, 0.12]} color={LEGO_COLORS.transClear} radius={0.025} transparent transmission={1} />
        <RoundedPart position={[0, 4.95, -4.85]} rotation={[0.2, 0, 0]} scale={[5.75, 2.35, 0.12]} color={LEGO_COLORS.transClear} radius={0.025} transparent transmission={1} />
        <RoundedPart position={[-3.23, 4.9, -1.55]} scale={[0.1, 2.35, 5.45]} color={LEGO_COLORS.transClear} radius={0.02} transparent transmission={1} />
        <RoundedPart position={[3.23, 4.9, -1.55]} scale={[0.1, 2.35, 5.45]} color={LEGO_COLORS.transClear} radius={0.02} transparent transmission={1} />
      </Assemble>

      {/* 15. Interior */}
      <Assemble start={MODULE.interior} lift={2.4}>
        {[-1.5, 1.5].map((x) => (
          <group key={x} position={[x, 3.45, -1.4]}>
            <RoundedPart position={[0, 0.45, 0]} scale={[1.75, 0.82, 2.3]} color={LEGO_COLORS.black} radius={0.09} />
            <RoundedPart position={[0, 1.15, -0.58]} rotation={[0.16, 0, 0]} scale={[1.75, 1.35, 0.27]} color={LEGO_COLORS.black} radius={0.08} />
          </group>
        ))}
        <RoundedPart position={[0, 4.2, 1.2]} scale={[6.4, 0.52, 0.65]} color={LEGO_COLORS.darkGray} radius={0.06} />
        <mesh position={[1.75, 4.2, 1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.62, 0.11, 16, 36]} />
          <meshStandardMaterial color={LEGO_COLORS.black} roughness={0.45} />
        </mesh>
        <RoundedPart position={[0.3, 3.8, 0.25]} scale={[0.14, 0.74, 0.14]} color="#D7DDE0" radius={0.04} metalness={0.58} />
      </Assemble>

      {/* 16. Lights, grille, mirrors, wipers, plate */}
      <Assemble start={MODULE.details} lift={1.8}>
        <Headlight x={-2.45} lit={lightsOn} />
        <Headlight x={2.45} lit={lightsOn} />
        <RoundedPart position={[0, 2.28, 11.02]} scale={[3.5, 0.68, 0.18]} color="#252F34" radius={0.03} metalness={0.56} />
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => (
          <RoundedPart key={x} position={[x, 2.3, 11.15]} scale={[0.12, 0.52, 0.05]} color="#D5DADD" radius={0.01} metalness={0.72} />
        ))}
        <RoundedPart position={[0, 1.6, 11.2]} scale={[6.6, 0.35, 0.32]} color="#C1C9CC" radius={0.04} metalness={0.7} />
        {[-3.98, 3.98].map((x) => (
          <RoundedPart key={x} position={[x, 4.0, 0.4]} scale={[0.55, 0.27, 1.08]} color={LEGO_COLORS.orange} radius={0.06} />
        ))}
        {[-1.25, 1.25].map((x) => (
          <RoundedPart key={x} position={[x, 4.16, 1.95]} rotation={[0, 0, wiper]} scale={[0.08, 0.08, 1.2]} color={LEGO_COLORS.black} radius={0.02} />
        ))}
        <RoundedPart position={[0, 2.1, -11.12]} scale={[2.2, 0.6, 0.14]} color={LEGO_COLORS.white} radius={0.025} />
        <RoundedPart position={[0, 2.1, -11.22]} scale={[1.62, 0.18, 0.035]} color={LEGO_COLORS.black} radius={0.01} />
        {[-2.35, 2.35].map((x) => (
          <RoundedPart key={x} position={[x, 2.48, -11.05]} scale={[1.0, 0.38, 0.12]} color={LEGO_COLORS.red} radius={0.04} emissive={lightsOn ? LEGO_COLORS.red : '#000000'} emissiveIntensity={lightsOn ? 0.42 : 0} />
        ))}
      </Assemble>

      {/* A few visible studs preserve the physical construction language. */}
      {[[-2.5, 3.3, 5.1], [-1.5, 3.3, 5.1], [-0.5, 3.3, 5.1], [0.5, 3.3, 5.1], [1.5, 3.3, 5.1], [2.5, 3.3, 5.1]].map((point, index) => (
        <Stud key={index} color={LEGO_COLORS.orange} position={point as V3} />
      ))}
    </group>
  );
};
