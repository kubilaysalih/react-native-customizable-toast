import { Extrapolate, interpolate } from 'react-native-reanimated';
import type { ToastItemProps } from '../../typings';
import { clamp } from '../../helpers/clamp';

export const defaultStyleWorklet = ({
  itemLayout: { y },
  gesture: { translationY },
  properties: { loading },
}: ToastItemProps) => {
  'worklet';

  return {
    transform: [
      {
        translateY: clamp(translationY.value, -y.value, 0),
      },
      {
        scale: loading
          ? 1
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
