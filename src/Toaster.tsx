import React, { createRef } from "react";
import { ToasterBase } from "./ToasterBase";
import type { ToastProperties } from "./components/Toast/typings";
import type { ToasterMethods } from "./typings";
import { defaultStyleWorklet } from "./components/ToastContainer/defaultStyleWorklet";

export const ToasterRef = createRef<ToasterMethods<ToastProperties>>();

export const ToasterHelper = {
  show: (options: ToastProperties) => ToasterRef.current?.show(options),
  hide: (id: string) => ToasterRef.current?.hide(id),
  filter: (fn: (value: ToastProperties, index: number) => void) =>
    ToasterRef.current?.filter(fn),
  update: (id: string, options: Partial<ToastProperties>) =>
    ToasterRef.current?.update(id, options),
};

export interface ToasterProps {
  displayFromBottom?: boolean;
  useSafeArea?: boolean;
}

export const Toaster = ({ useSafeArea, displayFromBottom }: ToasterProps) => {
  return (
    <ToasterBase
      onSwipeEdge={({ filter }) => filter((e) => e.loading)}
      ref={ToasterRef}
      itemStyle={defaultStyleWorklet}
      displayFromBottom={displayFromBottom}
      useSafeArea={useSafeArea}
    />
  );
};
