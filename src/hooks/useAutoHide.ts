import { useEffect } from "react";
import { useToast } from "./useToast";

export const useAutoHide = () => {
  const { hide, timeout = 7000 } = useToast<{ timeout: number }>();

  useEffect(() => {
    let n: ReturnType<typeof setTimeout> | null = null;
    if (timeout) {
      n = setTimeout(() => {
        hide();
      }, timeout);
    }
    return () => {
      if (n) clearTimeout(n);
    };
  }, []);
};
