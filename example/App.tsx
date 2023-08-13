import React, { useState } from 'react';
// import 'react-native-reanimated';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { Toaster, ToasterHelper } from 'react-native-customizable-toast';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { CustomToaster, CustomToasterHelper } from './CustomToaster';

LogBox.ignoreLogs(['Require cycle: ../src/index.ts']);

const dummy = [
  'Lorem ipsum dolor sit amet.',
  'Cras urna lacus, facilisis vitae.',
  'Nulla nec vestibulum odio. Fusce.',
  'Ut sit amet mauris pellentesque.',
  'Fusce egestas egestas mauris in.',
  'Phasellus molestie arcu velit, sit.',
  'Sed nec varius neque. Sed',
  'Maecenas interdum nisi arcu, ut scelerisque diam dignissim ac. Praesent.',
  'Sed viverra tellus nunc, at pulvinar sem sollicitudin eu. Nullam.',
];

const randomMessage = () => dummy[Math.floor(Math.random() * dummy.length)];

interface ContentProps {
  toggleSafeArea: () => void;
  togglePosition: () => void;
  displayFromBottom?: boolean;
  useSafeArea?: boolean;
}
const Content = ({
  toggleSafeArea,
  togglePosition,
  displayFromBottom,
  useSafeArea,
}: ContentProps) => {
  return (
    <View style={[styles.grow, styles.wrapper]}>
      <View style={styles.content}>
        <Button
          backgroundColor="#6d6d6d"
          text="Default"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'default',
              timeout: 2000,
            });
          }}
        />
        <Button
          backgroundColor="#0387d8"
          text="Info"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'info',
            });
          }}
        />
        <Button
          backgroundColor="#42d886"
          text="Success"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'success',
              timeout: 5000,
            });
          }}
        />
        <Button
          backgroundColor="#febc00"
          text="Warning"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'warning',
            });
          }}
        />
        <Button
          backgroundColor="#f94416"
          text="Error"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'error',
            });
          }}
        />
        <Button
          backgroundColor="#6d6d6d"
          text="Without Timeout"
          onPress={() => {
            ToasterHelper.show({
              text: randomMessage(),
              type: 'default',
              timeout: 0,
            });
          }}
        />
        <Button
          backgroundColor="#6d6d6d"
          text="With Loading"
          onPress={() => {
            const toast = ToasterHelper.show({
              text: randomMessage(),
              type: 'default',
              loading: true,
              timeout: 0,
            });

            setTimeout(() => {
              ToasterHelper.update(toast, {
                loading: false,
              });
            }, 3000);
          }}
        />
      </View>
      <View style={styles.content}>
        <Button
          backgroundColor="#6d6d6d"
          text="Custom Toast"
          onPress={() => {
            CustomToasterHelper.show({
              text: randomMessage(),
              dismissible: false,
              backgroundColor:
                '#' + Math.floor(Math.random() * 16777215).toString(16), // random hex generator,
            });
          }}
        />
      </View>
      <View style={styles.content}>
        <Button
          backgroundColor="#6d6d6d"
          text={'Position: ' + (displayFromBottom ? 'Bottom' : 'Top')}
          onPress={togglePosition}
        />
        <Button
          backgroundColor="#6d6d6d"
          text={'SafeArea?: ' + (useSafeArea ? 'Yes' : 'No')}
          onPress={toggleSafeArea}
        />
      </View>
    </View>
  );
};

const Button = ({
  text,
  onPress,
  backgroundColor,
}: {
  text: string;
  onPress(): void;
  backgroundColor: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [displayFromBottom, setDisplayFromBottom] = useState(false);
  const [useSafeArea, setUseSafeArea] = useState(false);
  return (
    <GestureHandlerRootView style={[styles.grow]}>
      <Content
        toggleSafeArea={() => setUseSafeArea((prev) => !prev)}
        togglePosition={() => setDisplayFromBottom((prev) => !prev)}
        useSafeArea={useSafeArea}
        displayFromBottom={displayFromBottom}
      />

      <Toaster
        useSafeArea={useSafeArea}
        displayFromBottom={displayFromBottom}
      />

      <CustomToaster
        useSafeArea={useSafeArea}
        displayFromBottom={displayFromBottom}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  buttonText: {
    color: 'white',
  },
});
