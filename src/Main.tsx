import {EffectComposer, Bloom, DepthOfField, N8AO, SMAA, Vignette} from '@react-three/postprocessing';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEffect} from 'react';
import {ACESFilmicToneMapping, PCFSoftShadowMap} from 'three';
import {SfxTrack} from './audio/SfxTrack';
import {MechanicMinifigure} from './lego/Minifigure';
import {RetroCoupe} from './lego/RetroCoupe';
import {ManualOverlay} from './overlay/ManualOverlay';
import {CameraRig} from './scenes/CameraRig';
import {Garage} from './scenes/Garage';

export type MainProps = {
  soundEnabled: boolean;
};

const RendererSettings: React.FC = () => {
  const {gl} = useThree();
  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;
  }, [gl]);
  return null;
};

const ExhaustSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 16590 || frame > 17420) return null;
  return (
    <group>
      {[0, 1, 2, 3, 4].map((index) => {
        const age = (frame - 16590 + index * 17) % 105;
        const size = 0.18 + age / 100;
        return (
          <mesh key={index} position={[1.9 + Math.sin((age + index * 14) / 13) * 0.12, 1.15 + age / 38, -11.6 - age / 22]}>
            <sphereGeometry args={[size, 20, 16]} />
            <meshStandardMaterial color="#99A4A7" transparent opacity={Math.max(0, 0.25 - age / 600)} roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
};

const GarageWorld: React.FC = () => {
  return (
    <>
      <RendererSettings />
      <CameraRig />
      <ambientLight intensity={0.52} color="#D9E7E8" />
      <hemisphereLight args={['#D5F4FF', '#515B5E', 0.72]} />
      <directionalLight
        position={[16, 22, 8]}
        intensity={3.25}
        color="#D8F2FF"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={4}
      />
      <spotLight position={[-8, 15, 7]} angle={0.55} penumbra={0.75} intensity={110} color="#FFE4AE" castShadow />
      <spotLight position={[8, 14, -4]} angle={0.55} penumbra={0.75} intensity={85} color="#FFE4AE" castShadow />
      <Garage />
      <RetroCoupe />
      <MechanicMinifigure />
      <ExhaustSmoke />
      <EffectComposer multisampling={8}>
        <N8AO aoRadius={0.5} intensity={1.7} distanceFalloff={1.2} />
        <DepthOfField focusDistance={0.018} focalLength={0.045} bokehScale={1.8} height={480} />
        <Bloom intensity={0.28} luminanceThreshold={0.92} mipmapBlur />
        <SMAA />
        <Vignette eskil={false} offset={0.17} darkness={0.15} />
      </EffectComposer>
    </>
  );
};

export const Main: React.FC<MainProps> = ({soundEnabled}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#CBD6D8'}}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        dpr={1}
        gl={{antialias: true, preserveDrawingBuffer: true}}
        camera={{fov: 30, near: 0.1, far: 180, position: [22, 16, 31]}}
      >
        <GarageWorld />
      </ThreeCanvas>
      <ManualOverlay />
      <SfxTrack enabled={soundEnabled} />
    </AbsoluteFill>
  );
};
