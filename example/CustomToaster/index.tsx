import React, { createRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ToasterBase,
  ToasterMethods,
  useToast,
  Swipeable,
  ToastItemProps,
} from 'react-native-customizable-toast';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  Extrapolate,
  interpolate,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';

type MyCustomToaster = {
  text: string;
  dismissible?: boolean;
  backgroundColor?: string;
};

const CustomToasterRef = createRef<ToasterMethods<MyCustomToaster>>();

export const CustomToasterHelper = {
  show: (options: MyCustomToaster) => CustomToasterRef.current?.show(options)!,
  hide: (id: string) => CustomToasterRef.current?.hide(id),
  filter: (fn: (value: MyCustomToaster, index: number) => void) =>
    CustomToasterRef.current?.filter(fn),
  update: (id: string, options: Partial<MyCustomToaster>) =>
    CustomToasterRef.current?.update(id, options),
};

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

export const customStyleWorklet = ({
  itemLayout: { y },
  gesture: { translationY },
  properties: { index },
  displayFromBottom,
}: ToastItemProps) => {
  'worklet';

  return {
    transform: [
      {
        translateY: clamp(translationY.value, -y.value, 0),
      },
      {
        translateX: interpolate(
          -translationY.value - y.value,
          [0, 100],
          [0, index % 2 ? 1000 : -1000],
          Extrapolate.CLAMP
        ),
      },
      displayFromBottom ? { rotate: '-180deg' } : { rotate: '0deg' },
    ],
  };
};

const CustomToastComponent = () => {
  const {
    text,
    hide,
    dismissible,
    backgroundColor = '#222',
  } = useToast<MyCustomToaster>();

  return (
    <Swipeable onSwipe={hide} disabled={!dismissible}>
      <View style={styles.container}>
        <TouchableOpacity
          disabled={!dismissible}
          style={[
            styles.touchable,
            {
              backgroundColor,
            },
          ]}
          onPress={hide}
        >
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

interface CustomToasterProps {
  displayFromBottom?: boolean;
  useSafeArea?: boolean;
}
export const CustomToaster = ({
  useSafeArea,
  displayFromBottom,
}: CustomToasterProps) => {
  return (
    <ToasterBase
      entering={SlideInLeft}
      exiting={SlideOutRight}
      onSwipeEdge={({ filter }) => filter((e) => !e.dismissible)}
      ref={CustomToasterRef}
      render={CustomToastComponent}
      itemStyle={customStyleWorklet}
      displayFromBottom={displayFromBottom}
      useSafeArea={useSafeArea}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  touchable: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10,
    minHeight: 40,
  },
  text: {
    color: '#ffffff',
    flex: 1,
  },
});
