import { Composition } from "remotion";
import {
  SPLASH_DURATION_FRAMES,
  WaterSplash,
  SPLASH_HEIGHT,
  SPLASH_WIDTH,
} from "./compositions/WaterSplash";
import {
  WATERFALL_DURATION_FRAMES,
  WaterfallFlow,
  WATERFALL_HEIGHT,
  WATERFALL_WIDTH,
} from "./compositions/WaterfallFlow";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="WaterfallFlow"
        component={WaterfallFlow}
        durationInFrames={WATERFALL_DURATION_FRAMES}
        fps={30}
        width={WATERFALL_WIDTH}
        height={WATERFALL_HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="WaterSplash"
        component={WaterSplash}
        durationInFrames={SPLASH_DURATION_FRAMES}
        fps={30}
        width={SPLASH_WIDTH}
        height={SPLASH_HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
