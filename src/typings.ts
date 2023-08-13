import type { ViewProps } from 'react-native';
import type { useAnimatedStyle } from 'react-native-reanimated';
import type Animated from 'react-native-reanimated';

export type Toast = {
  id: string;
};

export type ContextType = {
  startX: number;
};

export type ToastOptions = Omit<Toast, 'id'>;

export interface ToasterMethods<T = void> {
  show: (options: T) => string;
  hide: (id: string) => void;
  filter: (fn: (value: T, index: number) => void) => void;
  update: (id: string, options: Partial<T>) => void;
}

type OnSwipeEdge<T> = {
  hideAll: () => void;
  hide: (id: string) => void;
  filter: (fn: (value: T, index: number) => void) => void;
};

type LayoutAnimationProps = Pick<
  Animated.AnimateProps<ViewProps>,
  'layout' | 'entering' | 'exiting'
>;

type Translation = {
  translationY: Animated.SharedValue<number>;
  translationX: Animated.SharedValue<number>;
};

type Layout = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  width: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
};

export type ToastItemProps = {
  gesture: Translation;
  containerLayout: Layout;
  itemLayout: Layout;
  properties: {
    [key: string]: any;
    index: number;
  };
};

export interface ToasterProps<T = void> extends LayoutAnimationProps {
  render?: React.ElementType;
  itemStyle?: (value: ToastItemProps) => ReturnType<typeof useAnimatedStyle>;
  onSwipeEdge?: (helpers: OnSwipeEdge<T>) => void;
  displayFromBottom?: boolean;
  useSafeArea?: boolean;
}

export type BaseProps = {
  id: string;
  hide: () => void;
  index: number;
};

export type ToastProps<T = void> = T extends void ? BaseProps : T & BaseProps;

export interface ToastContainerProps extends LayoutAnimationProps {
  index: number;
  gestureValues: Translation;
  containerLayout: Layout;
  itemStyle?: (value: ToastItemProps) => ReturnType<typeof useAnimatedStyle>;
}
