import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CUES} from './cues';

const pickVariant = (frame: number, variants: number) => (Math.imul(frame, 2_654_435_761) >>> 0) % variants;

type SfxTrackProps = {enabled?: boolean};

/**
 * The production-ready SFX router. It is deliberately disabled by default: no
 * third-party SFX are bundled in this repository. Put licensed WAV files in
 * public/sfx using the IDs from the supplied script, then enable this track.
 */
export const SfxTrack: React.FC<SfxTrackProps> = ({enabled = false}) => {
  if (!enabled) return null;

  return (
    <>
      <Audio
        src={staticFile('sfx/AMB_garage_room.wav')}
        loop
        volume={(frame) => interpolate(frame, [0, 90, 16500, 16560], [0, 0.03, 0.03, 0.015], {extrapolateRight: 'clamp'})}
      />
      <Audio src={staticFile('sfx/AMB_tube_hum.wav')} loop volume={0.03} />
      <Audio src={staticFile('sfx/AMB_clock_tick.wav')} loop volume={0.03} />
      {CUES.map((cue, index) => {
        const variants = cue.variants ?? 1;
        const suffix = variants > 1 ? `_${String(pickVariant(cue.f, variants) + 1).padStart(2, '0')}` : '';
        return (
          <Sequence key={`${cue.f}-${cue.id}-${index}`} from={cue.f} layout="none">
            <Audio src={staticFile(`sfx/${cue.id}${suffix}.wav`)} volume={cue.v ?? 0.2} />
          </Sequence>
        );
      })}
      <Sequence from={16590} layout="none">
        <Audio src={staticFile('sfx/ENG_idle.wav')} loop volume={0.32} />
      </Sequence>
    </>
  );
};
