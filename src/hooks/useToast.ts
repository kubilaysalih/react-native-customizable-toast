import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import type { BaseProps } from "../typings";

export const useToast = <T = void>() => {
  return useContext<T extends object ? T & BaseProps : BaseProps>(ToastContext);
};
