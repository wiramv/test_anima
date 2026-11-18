import {Composition} from 'remotion';
import {CarAssembly} from './CarAssembly';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CarAssembly"
        component={CarAssembly}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          workshopName: 'BENGKEL MINI',
        }}
      />
    </>
  );
};
