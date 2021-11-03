/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  createElement,
  useImperativeHandle,
  useState,
  Ref,
  ReactElement,
  FunctionComponent,
  ComponentClass,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast as ToastComponent } from './components/Toast';
import { ToastContainer } from './components/ToastContainer';
import { ToastContext } from './contexts/ToastContext';

import type {
  Toast,
  ToasterMethods,
  ToasterProps,
  ToastOptions,
} from './typings';

const ToasterBaseWithoutRef = <
  T extends FunctionComponent<any> | ComponentClass<any, any>
>(
  { render = ToastComponent, ...rest }: ToasterProps,
  ref: Ref<ToasterMethods<T>>
) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useImperativeHandle(ref, () => ({
    show: _show,
    hide: _hide,
    update: _update,
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

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <View
        style={{
          flexDirection: 'column-reverse',
        }}
      >
        {toasts.map((e, index) => {
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
              <ToastContainer {...rest} index={index} key={e.id}>
                {createElement(render)}
              </ToastContainer>
            </ToastContext.Provider>
          );
        })}
      </View>
    </View>
  );
};

export const ToasterBase = forwardRef(ToasterBaseWithoutRef) as <T>(
  props: ToasterProps & { ref: Ref<ToasterMethods<T>> }
) => ReactElement;
