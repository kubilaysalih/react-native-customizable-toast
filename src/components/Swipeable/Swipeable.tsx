import React, { memo, type PropsWithChildren } from "react";
import { Dimensions } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SwipeableProps } from "./typings";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Swipeable = memo(
  ({
    onSwipe,
    disabled = false,
    children,
  }: PropsWithChildren<SwipeableProps>) => {
    const translateX = useSharedValue(0);

    const panGesture = Gesture.Pan()
      .onStart((event) => {
        translateX.value = event.translationX;
      })
      .onChange((event) => {
        translateX.value += event.changeX;
      })
      .onEnd(() => {
        const willDisappear =
          translateX.value > SCREEN_WIDTH / 3 ||
          translateX.value < -SCREEN_WIDTH / 3;
        const direction = Math.sign(translateX.value);
        const position = willDisappear ? direction * 800 : 0;
        translateX.value = withTiming(position, undefined, (finished) => {
          if (finished && willDisappear) {
            runOnJS(onSwipe)();
          }
        });
      })
      .activeOffsetX([-10, 10])
      .enabled(!disabled);
    const swipeableStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={swipeableStyle}>{children}</Animated.View>
      </GestureDetector>
    );
  },
);
