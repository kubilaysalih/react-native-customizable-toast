import React, { memo, PropsWithChildren } from 'react';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import type { ToastContainerProps } from '../../typings';

export const ToastContainer = memo(
  ({
    children,
    entering = FadeIn,
    exiting = FadeOut,
    layout = Layout.springify(),
  }: PropsWithChildren<ToastContainerProps>) => {
    return (
      <Animated.View entering={entering} exiting={exiting} layout={layout}>
        {children}
      </Animated.View>
    );
  }
);
