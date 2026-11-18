import {Composition} from 'remotion';
import {Main} from './Main';
import {DURATION, FPS} from './scenes/timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LegoCar"
      component={Main}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        // No third-party SFX are committed. Add licensed WAVs in public/sfx,
        // then turn this on for the fully cued silent-film sound mix.
        soundEnabled: false,
      }}
    />
  );
};
