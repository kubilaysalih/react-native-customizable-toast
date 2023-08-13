import { Extrapolate, interpolate } from 'react-native-reanimated';
import type { ToastItemProps } from '../../typings';
import { clamp } from '../../helpers/clamp';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const defaultStyleWorklet = ({
  itemLayout: { y },
  gesture: { translationY },
  properties: { loading },
  displayFromBottom,
}: ToastItemProps) => {
  'worklet';

  return {
    transform: [
      {
        translateY: displayFromBottom
          ? clamp(translationY.value, 0, y.value) // TODO
          : clamp(translationY.value, 0, y.value),
      },
      {
        scale: loading
          ? 1
          : displayFromBottom
          ? interpolate(
              translationY.value - y.value,
              [0, 100],
              [1, 0],
              Extrapolate.CLAMP
            )
          : interpolate(
              -translationY.value - y.value,
              [0, 100],
              [1, 0],
              Extrapolate.CLAMP
            ),
      },
    ],
  };
};
