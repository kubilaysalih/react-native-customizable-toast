import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export const useLayout = () => {
  const itemY = useSharedValue<number>(0);
  const itemX = useSharedValue<number>(0);
  const itemWidth = useSharedValue<number>(0);
  const itemHeight = useSharedValue<number>(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { height, width, x, y },
      },
    } = e;
    itemY.value = y;
    itemX.value = x;
    itemWidth.value = width;
    itemHeight.value = height;
  }, []);

  return {
    x: itemX,
    y: itemY,
    width: itemWidth,
    height: itemHeight,
    onLayout,
  };
};
