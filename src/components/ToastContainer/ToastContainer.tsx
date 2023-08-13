import React, { memo, type PropsWithChildren } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useToast } from '../../hooks/useToast';
import { useLayout } from '../../hooks/useLayout';
import type { ToastContainerProps } from '../../typings';

export const ToastContainer = memo(
  ({
    index,
    children,
    entering = FadeIn,
    exiting = FadeOut,
    layout = Layout.springify(),
    gestureValues,
    containerLayout,
    itemStyle,
  }: PropsWithChildren<ToastContainerProps>) => {
    const { y, x, height, width, onLayout } = useLayout();
    const toast = useToast();

    const styles = useAnimatedStyle(() => {
      return itemStyle
        ? itemStyle({
            gesture: gestureValues,
            itemLayout: {
              x,
              y,
              height,
              width,
            },
            containerLayout: containerLayout,
            properties: {
              ...toast,
              index,
            },
          })
        : {};
    });

    return (
      <Animated.View
        style={[styles]}
        entering={entering}
        exiting={exiting}
        layout={layout}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>
    );
  }
);
