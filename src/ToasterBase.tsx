import React, {
  forwardRef,
  createElement,
  useImperativeHandle,
  useState,
  Ref,
  ReactElement,
  RefObject,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast as ToastComponent } from './components/Toast';
import { ToastContainer } from './components/ToastContainer';
import { ToastContext } from './contexts/ToastContext';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import type {
  Toast,
  ToasterMethods,
  ToasterProps,
  ToastOptions,
} from './typings';
import { useLayout } from './hooks/useLayout';
import { useContainerSwipeGesture } from './hooks/useContainerSwipeGesture';

const ToasterBaseWithoutRef = <T extends object>(
  { render = ToastComponent, onSwipeEdge, itemStyle, ...rest }: ToasterProps<T>,
  ref: Ref<ToasterMethods<T>>
) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { height, x, y, width, onLayout } = useLayout();

  useImperativeHandle(ref, () => ({
    show: _show,
    hide: _hide,
    update: _update,
    filter: _filter,
  }));

  const _show = (options?: ToastOptions) => {
    const id = Date.now().toString();
    setToasts([...toasts, { ...options, id }]);
    return id;
  };

  const _update = (id: string, options?: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...options } : e))
    );
  };

  const _hide = (id: string) => {
    setToasts((prev) => prev.filter((e) => e.id !== id));
  };

  const _filter = (fn: (value: any, index: number) => void) => {
    setToasts((prev) => prev.filter(fn));
  };

  const _hideAll = () => {
    setToasts([]);
  };

  const { panGesture, translationY, translationX } = useContainerSwipeGesture({
    onFinish: () => {
      if (onSwipeEdge) {
        onSwipeEdge({ filter: _filter, hide: _hide, hideAll: _hideAll });
        return;
      }
      _hideAll();
    },
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <PanGestureHandler
        activeOffsetY={[-10, 10]}
        enabled={!!itemStyle}
        onGestureEvent={panGesture}
      >
        <Animated.View onLayout={onLayout}>
          {[...toasts].reverse().map((e, index) => {
            const hide = () => _hide(e.id);
            return (
              <ToastContext.Provider
                key={e.id}
                value={{
                  index,
                  hide,
                  ...e,
                }}
              >
                <ToastContainer
                  {...rest}
                  index={index}
                  key={e.id}
                  gestureValues={{
                    translationY,
                    translationX,
                  }}
                  containerLayout={{
                    height,
                    x,
                    y,
                    width,
                  }}
                  itemStyle={itemStyle}
                >
                  {createElement(render)}
                </ToastContainer>
              </ToastContext.Provider>
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export const ToasterBase = forwardRef(ToasterBaseWithoutRef) as <T>(
  props: ToasterProps<
    T extends RefObject<ToasterMethods<infer I>> ? I : never
  > & {
    ref: T;
  }
) => ReactElement;
