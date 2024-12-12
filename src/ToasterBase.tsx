import React, {
  createElement,
  useImperativeHandle,
  useState,
  type Ref,
} from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Toast as ToastComponent } from "./components/Toast";
import { ToastContainer } from "./components/ToastContainer";
import { ToastContext } from "./contexts/ToastContext";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";

import type {
  Toast,
  ToasterMethods,
  ToasterProps,
  ToastOptions,
} from "./typings";
import { useLayout } from "./hooks/useLayout";
import { useContainerSwipeGesture } from "./hooks/useContainerSwipeGesture";
import { defaultStyleWorklet } from "./components/ToastContainer/defaultStyleWorklet";

export const ToasterBase = <T extends object>(
  {
    render = ToastComponent,
    onSwipeEdge,
    itemStyle = defaultStyleWorklet,
    displayFromBottom = false,
    useSafeArea,
    ref,
    ...rest
  }: ToasterProps<T> & {ref: Ref<ToasterMethods<T>>}
) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { height, x, y, width, onLayout } = useLayout();
  const WrapperComponent = useSafeArea ? SafeAreaView : View;

  useImperativeHandle(ref, () => ({
    show: _show,
    hide: _hide,
    update: _update,
    filter: _filter,
  }));

  const _show = (options?: ToastOptions) => {
    const id =
      Date.now().toString() + (Math.random() + 1).toString(36).substring(10); // Strengthen Collision detection
    setToasts((prev) => [...prev, { ...options, id }]);
    return id;
  };

  const _update = (id: string, options?: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...options } : e)),
    );
  };

  const _hide = (id: string) => {
    setToasts((prev) => prev.filter((e) => e.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _filter = (fn: (value: any, index: number) => void) => {
    setToasts((prev) => prev.filter(fn));
  };

  const _hideAll = () => {
    setToasts([]);
  };

  const { panGesture, translationY, translationX } = useContainerSwipeGesture({
    displayFromBottom,
    activeOffsetY: [-10, 10],
    onFinish: () => {
      if (onSwipeEdge) {
        onSwipeEdge({ filter: _filter, hide: _hide, hideAll: _hideAll });
        return;
      }
      _hideAll();
    },
  });

  return (
    <WrapperComponent
      style={[
        StyleSheet.absoluteFillObject,
        {
          transform: [
            displayFromBottom ? { rotate: "180deg" } : { rotate: "0deg" },
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={panGesture}>
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
                  displayFromBottom={displayFromBottom}
                >
                  {createElement(render)}
                </ToastContainer>
              </ToastContext.Provider>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </WrapperComponent>
  );
};
