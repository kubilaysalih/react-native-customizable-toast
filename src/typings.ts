import type { ViewProps } from 'react-native';
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
  update: (id: string, options: Partial<T>) => void;
}

type LayoutAnimationProps = Pick<
  Animated.AnimateProps<ViewProps>,
  'layout' | 'entering' | 'exiting'
>;

export interface ToasterProps extends LayoutAnimationProps {
  render?: React.ElementType;
}

export type BaseProps = {
  id: string;
  hide: () => void;
  index: number;
};

export type ToastProps<T = void> = T extends void ? BaseProps : T & BaseProps;

export interface ToastContainerProps extends LayoutAnimationProps {
  index: number;
}
