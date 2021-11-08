import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const useContainerSwipeGesture = ({
  onFinish,
}: {
  onFinish(): void;
}) => {
  const translationY = useSharedValue<number>(0);
  const translationX = useSharedValue<number>(0);

  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    any
  >({
    onStart: (_, context) => {
      context.startX = translationX.value;
      context.startY = translationY.value;
    },
    onActive: (event, context) => {
      translationX.value = context.startX + event.translationX;
      translationY.value = context.startY + event.translationY;
    },
    onFinish: (event) => {
      if (event.absoluteY < 100) {
        runOnJS(onFinish)();
      }
      translationY.value = withTiming(0);
    },
  });

  return {
    panGesture,
    translationY,
    translationX,
  };
};
