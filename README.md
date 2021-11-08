<h1 align="center">react-native-customizable-toast</h1>

<p align="center">
  <h4>yet another toast library based on reanimated 2 layout animations</h4>
  <img style="text-align: center" src="https://imgur.com/vpOfl05.gif" />
</p>


## Features
- Imperative API
- Fully Customizable
  - Custom toast renderer
  - Custom vertical swipe animations
  - Custom layout animations
- Swipeable both vertical and horizontal
- Fully typed with TypeScript

## Requirements
- react-native-reanimated ^2.3.0
- react-native-gesture-handler ^1.10.0

## Installation

```sh
npm install react-native-customizable-toast
```

## Basic Usage
Use default Toaster component in your base component.

```js
import { Toaster } from "react-native-customizable-toast";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Content />

      <Toaster />
    </View>
  );
}

```

Use ToasterHelper to show a simple toast.

```js
import { ToasterHelper } from "react-native-customizable-toast";

ToasterHelper.show({
  text: 'lorem ipsum',
  type: 'success',
  timeout: 5000,
});

```

## Default Methods

```js
// show toast
const toast = ToasterHelper.show({
  text: 'custom string',
  timeout: 5000,
  type: 'info',
  onPress: () => {},
  dismissible: false,
  loading: true,
});

// update toast
ToasterHelper.update(toast, {
  dismissible: true,
  loading: false,
});


// hide toast
ToasterHelper.hide(toast)
```
## Customizing

If you want to change toaster, toast or animations, you can look into default [Toaster](https://github.com/kubilaysalih/react-native-customizable-toast/blob/main/src/Toaster.tsx) component.


## TODO
- [ ] Better README.md or docs

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
