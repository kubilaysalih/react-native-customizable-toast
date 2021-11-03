import React, { createRef } from 'react';
import { ToasterBase } from './ToasterBase';
import type { ToastProperties } from './components/Toast/typings';
import type { ToasterMethods, ToastOptions, ToasterProps } from './typings';
import { Toast } from './components/Toast';

export const ToasterRef = createRef<ToasterMethods<ToastProperties>>();

export const ToasterHelper = {
  show: (options: ToastOptions & ToastProperties) =>
    ToasterRef.current?.show(options)!,
  hide: (id: string) => ToasterRef.current?.hide(id),
  update: (id: string, options: Partial<ToastProperties>) =>
    ToasterRef.current?.update(id, options),
};

export const Toaster = (props: ToasterProps) => {
  return <ToasterBase {...props} ref={ToasterRef} render={Toast} />;
};
