import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {sceneForFrame, stepForFrame} from '../scenes/timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PartIcon: React.FC<{color: string; long?: boolean}> = ({color, long = false}) => (
  <div style={{position: 'relative', width: long ? 86 : 48, height: 32, borderRadius: 7, background: color, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.12), 0 3px 7px rgba(7,19,25,0.13)'}}>
    {Array.from({length: long ? 4 : 2}).map((_, index) => (
      <span key={index} style={{position: 'absolute', width: 10, height: 10, borderRadius: 99, top: -4, left: 8 + index * 19, background: color, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35)'}} />
    ))}
  </div>
);

const PLIPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = sceneForFrame(frame);
  const local = frame - scene.from;
  const visible = scene.stepStart ? interpolate(local, [0, 8, 34, 52], [0, 1, 1, 0], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const color = scene.id === 'wheels' ? '#05131D' : scene.id === 'upperbody' || scene.id === 'details' ? '#FE8A18' : '#A0A5A9';
  if (!scene.stepStart) return null;

  return (
    <div style={{position: 'absolute', top: 52, left: 56, display: 'flex', gap: 13, padding: '15px 17px', opacity: visible, transform: `translateY(${(1 - visible) * -16}px)`, background: 'rgba(255,255,255,0.93)', border: '2px solid rgba(5,19,29,0.12)', borderRadius: 18, boxShadow: '0 14px 28px rgba(6,22,32,0.16)'}}>
      <PartIcon color={color} long={scene.id === 'chassis' || scene.id === 'lowerbody'} />
      <div style={{alignSelf: 'center', fontSize: 25, fontWeight: 900, color: '#172B35'}}>×{scene.id === 'wheels' ? '4' : '2'}</div>
    </div>
  );
};

const StepCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const step = stepForFrame(frame);
  if (step === 0 || frame >= 17400) return null;
  const scene = sceneForFrame(frame);
  const pop = interpolate(frame - scene.from, [0, 8, 16], [0.7, 1.12, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 56, bottom: 54, transform: `scale(${pop})`, transformOrigin: 'bottom left', background: '#FFFFFF', border: '3px solid #172B35', borderRadius: 21, boxShadow: '0 15px 30px rgba(3,20,29,0.18)', minWidth: 132, padding: '12px 19px 10px'}}>
      <div style={{fontSize: 11, color: '#68808A', fontWeight: 900, letterSpacing: 2.1}}>STEP</div>
      <div style={{fontSize: 58, lineHeight: 0.95, color: '#172B35', fontWeight: 950, letterSpacing: -3}}>{String(step).padStart(2, '0')}</div>
    </div>
  );
};

const Callout: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = sceneForFrame(frame);
  if (!scene.stepStart) return null;
  const local = frame - scene.from;
  const visible = interpolate(local, [24, 32, 95, 112], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: '56%', top: '42%', opacity: visible, transform: `translate(${Math.sin(frame / 8) * 5}px, ${Math.cos(frame / 8) * 4}px)`}}>
      <div style={{height: 6, width: 118, background: '#F2CD37', borderRadius: 99, transform: 'rotate(-28deg)', transformOrigin: 'left center', boxShadow: '0 0 0 3px rgba(255,255,255,0.8)'}} />
      <div style={{position: 'absolute', left: 107, top: -18, width: 0, height: 0, borderTop: '21px solid transparent', borderBottom: '21px solid transparent', borderLeft: '32px solid #F2CD37', transform: 'rotate(-28deg)'}} />
    </div>
  );
};

export const ManualOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [420, 450, 660, 720], [0, 1, 1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const ending = interpolate(frame, [17880, 17930, 18000], [0, 1, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{fontFamily: 'Arial, Helvetica, sans-serif', pointerEvents: 'none'}}>
      <PLIPanel />
      <StepCounter />
      <Callout />
      <div style={{position: 'absolute', inset: 0, opacity: title, display: 'grid', placeItems: 'center'}}>
        <div style={{marginTop: 10, textAlign: 'center', color: '#FFFFFF', fontSize: 96, fontWeight: 950, letterSpacing: -4, lineHeight: 0.94, textShadow: '0 7px 0 #A95500, 0 15px 32px rgba(0,0,0,0.28)'}}>MERAKIT<br />MOBIL</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: interpolate(frame, [0, 30, 17920, 18000], [1, 0, 0, 1], clamp)}} />
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: ending, color: '#FFFFFF'}}>
        <div style={{textAlign: 'center', marginTop: 120}}>
          <div style={{margin: '0 auto 28px', width: 80, height: 80, display: 'grid', placeItems: 'center', borderRadius: 99, background: '#F2CD37', color: '#172B35', fontSize: 53, fontWeight: 900}}>✓</div>
          <div style={{fontWeight: 950, fontSize: 69, letterSpacing: -3}}>SELESAI</div>
          <div style={{fontSize: 18, letterSpacing: 3, fontWeight: 800, marginTop: 18, opacity: 0.75}}>REMOTION + THREE.JS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
