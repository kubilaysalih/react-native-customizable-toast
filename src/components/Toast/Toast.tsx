import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import type { ToastProperties } from "../Toast/typings";
import { useToast } from "../../hooks/useToast";
import { Swipeable } from "../Swipeable";
import { useAutoHide } from "../../hooks/useAutoHide";

const ToastColors = {
  default: "#6d6d6d",
  success: "#42d886",
  error: "#f94416",
  info: "#0387d8",
  warning: "#febc00",
};

const ToastIcons = {
  success:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflCh4HMyyz1wfKAAACsElEQVRYw7WYvU9UQRRHz75dtSIaDZjwZaMJmICVQKQhsRJMjPZLYaGN0WDUyj9CbW2pZRu1IdAhUWwwUYgVECU0BoLBkLgcC54Lrm/fx7J7XzmT87sz8+beuTdHjAnQwkWGuEwvHZzkBLDLJt9Z4j3zfGYbcjGMXAw8zwXGGKWP0+QjppT5wSfe8JqvlONEIuAG9vncVfdMsj3XfGG/ganh2OpT1xLRh23Np7ZJooiIV5y1nAmvWnbW4QQJsWAxo+//rmPcgjH4Y064VTdedcsJj1kDn/ehP4+EV/3pQ/NG4HH8iN4frGK86ixEHHa1IXjV1arjFtucaRhedca2fYEgDAh3GclyFRNthDshWcRLDdyeg23qFwmAgNt0NdR/gC5uk9tfQa8rDfdfdcUeKQCjdNfppczzCrjFUERc7maMJWxxum4fS3aJeM53kePTtuCgG3Xip+yQ8HsSOWPDwYAhztS1PSXu8S0+m3GGwYDLkdkqNd79P+Zm5Kw8A/ix/s0Jb1GHpZozF3C9xtCecz7ykXP/pc1q/FSMK+v4q8bQnOdE7KwCZMHrDjXT+uPKH9J+CJINr+UEAf6VyIrXctwWdVVJZMfrTu1D1inbDwFbbc2M13VciBmuSBwOPxnwuoCTsROqJDLidRIf+DutRGb8b++nCXahRGa8bjiYLlxP2RleulIK7IFN21Jgm7dcTQhtNzhbSSxZ7C3biD3NTJkBsEyproyQHNKX//4Z/U1Yw0r4bMkBLPIyuXbIZPKSxUq+a+bT8eACNfPxG0oU3WwIftNiRCkl5p1oSAEyEVGAhBLNLKFCiYLFI5zFmsWYIrByFvWXsVfSVsrNK8QrIoF9PkvdSnhuX61WQnwz5DzXuUb/UZohsW/XsJ3TyxAD9NDBKY4Du2zxnS98SNPO+QNTfhhuetch0gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMC0zMFQwNzo1MTo0NCswMDowML6qiT0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTAtMzBUMDc6NTE6NDQrMDA6MDDP9zGBAAAAAElFTkSuQmCC",
  info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflCh4HNhGWyL+eAAAC90lEQVRYw7WYT0tUYRTGf/feMUEQo1IxwSBKZoZmWimiLoRWo36CaNxV1KIYJ2ojLaIPoEFtatvehbUS3Zq2KcGUIFBRRkGZS2IIXp8WczWdxnvfcZxzVxfOec6/9z3nPccigARQT5wuOojRSgO1wB551llklhkW+A1WAIYVAO5wkwH6SXAJpwSLxzbzfOYTP/GClJQAl62ExrSiA4XRgVb1RknZMgZHjRrRaij0cVrViJpEqBIh1K1peWXBS5KnafWEqBCKKF2m7Sf9GFJEAfA1ysg9M7wkucqoRqfAOxrWTkXwkrSjYTkqAY+GKrT+nxdDRbkQQj1aORd4SVopSrdQk6bODV6SptRUUGD7BeEhfQaXxGODDTwDzj4e+MhC6LZReDaVVVRRZbVpFKakkF8WxgwEPGWF/z0zuoijsgoKYlo2YM8prsOMxZUzkFhWVNhAP21mdapMamMAbOpJGbE3kipkDOin0UgmRX2EOAkjZpsXWEwAgzzHNpJJEEdPtW98uveVU64s/icROkp2q9Lk0FxWFhw6I8SMWA/YYheAOi4bBgggGuGqAZvHB97iYiEaeMx9Y69b0R+DWH5Ty2HpEmrRd+Ms7NrUGtixjXvsb4s14xDVmkXzFr2cLL/GZLNnwHWF97zjbolOFUZ7NnkjxjYeca+MA31Irl1GPM9CazaLVVWwaDNn1KHORh6zNjNsVU3BFl8iLDDPnRBGlwl+seT76vGRr1xnkIYQuXkWEMqG1sRs8QEVcpQNravZQsuMhrTMdbX/f/6F2rUeKHfUMpcYD3S0jubiyyuAZuoC5cZZwn+2JEOeLZPq1bWir1eTIfYnhbB8a0Z4FThqubgnnLBoCEyxeMnrowmtmk/HQwXVffz6KtLKnwt8XukSo5SQo8y5DCCZU8p6lUcoX0VE6Qpysap0wBB4lIuzj7HdppNy9QbxIyW2Eho1XiWMKXHaKiF4GXKDQVIkK1mGBC5J/HVOjC46idLKRS4Ae7is84M5k3XOX1Ov3s/0IxqWAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTEwLTMwVDA3OjU0OjE3KzAwOjAwIYtWgAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0xMC0zMFQwNzo1NDoxNyswMDowMFDW7jwAAAAASUVORK5CYII=",
  warning:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflCh4HNiNeH+4eAAACy0lEQVRYw9WYzW8NURiHn7m9WuqjKZVI1EeCaCOIsqAlPiPpgrBASEikJUHjqkXDP8DCRiJWrOy6JSyFVS0Rq2pSEiKiSBSppr2PRbXubWfuzP2w8FtNzn3f9zm/956Zc2bgf1eQNFCAahYBnxktIjFpebHVXvvtt9c2J4AVLd/moJMadHtFEWKdj8zVI+sqBhCx09E8wKhnKuZBXOlLp+ulKysCEAOvG6brBmUjRNzqh1DAB7eW3SZxjr1GqdfasgAiHvVHJOCnx8ryIC6xz0J65pKSASJeMZtT7q23vOXbnJGsV0v0IOL6nLtXP7lfxP1+yhl944aSEOIs7+S147G1Itb6OG/8rtXRgFRUeWAfR/IGRxgDYIyRvPEj7CPSQwQAqOcydYnMLuAy9UU5EOA4uxL3cycnojxEOVhFF+nEgDRdrE7sQEhxjubE5QGaOE9VmIcZAAHaOFVUeYCTtIW1KaxFc+lmcdGABrqZF+tAgMO0F10eoJ3DMz3MdLCUDLNLAtRwicaCDgToYHNJ5QFa6JzuIQcgwCY6yzrydLA5H5HfohoyLItMDkKupquRDDWhv4h40OECz/5XNjqxR7woEDXsodCnq9jgk4Kby7j3bHGdtx0rGPfUBkPnn4lJ1KxDfnQ8JmrM7hkexLX2Wym9tmkSkPqzfqq4wJrYNSLf+Z5g+1pNF2n/Zom7/Rw7r2/esNVWb/gtNvaLe6faJM73QQLj10yLmI446eXroQucmv9pf8UmfHWLkxPa4tfY+F92iKSA5WSoju1rlvGp63GysfHVXGQFpAg4w8bYcKinnUCEgHYWJsjYwFkC3OG7hItvyB6bbbbHoYQZ790ZeJ8DCWYz2ZohoIGqxBkPA4fD9qGK6UeqiLNDKapK0fdPAc9wtwMJ/7LiNeCeQNhGhk3Mrui7dcAIz7lJXzD1iSD+VitOoxOfHP5//QavcpeyTX2tGQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMC0zMFQwNzo1NDozNSswMDowMPQxQNQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTAtMzBUMDc6NTQ6MzUrMDA6MDCFbPhoAAAAAElFTkSuQmCC",
  error:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflCh4HNjmjfRdkAAACsUlEQVRYw7WYv09TcRTFP/22CAMEokiCJBgSDYXQOhiQAAMroIm4l1E3TWHlfwCcSIyOrBoTHRhgI6hbSRB0gTawEEyLDDSBHoe+AJLyemn77lvecO453/u+efdXCB8TQBO9DNJPDx00Uw/kybLPFt9ZZ5O/EPLhCPmQh3nIBOPEuE24BOSMP2zwlS/85sxPpAS5nGJaUFoFlbOCMnqruJzM5OiuZpUpS33ZMppVmygrIoSGtKqzG9FL0plWNVxGQiiixA3P/n8cU4rIh75OSeUqppeknJKq0zX0YU3ruCp6STrWtMIqQY+mqjz9RRRTV+5CCA0rXRN6SUpfuW6hNq3UjF6SVtRWFHBeQnjFqOEnKXDAAQUDcpSXHrMQemT6PKdaVJ/6tKhT02eKC3lpYcEUdkrtQqhdKRN+XiHhgG6em7LIHocAHLJnwk/SDQ4Yp9PkoBJvftbJBDiaGDPBK7Exmhy9xAITiNHrGOROYAJ3eOLoL1mtamNhBhw9gdEDRB33AhXocLQEKtDsqA9UoN4FSg848oHy5x1ZM7iBCAARGsw+OWdMXAAxRgAYucG/vxdhi8dGcCvv+Aw8o9UssIXemMpHZXaq1451L8sHYYd8c2yyYXbYYYkldsz4DTYRmjEGvKa4QgoprjWjx0yxJke1awCfaFJ4zwudGDx2FS3W5G0+GcI94heEihPLNkcGj49sF2uyeE+6LLyRzmKTA9ynsSw+zQevdguhWcMss6wuIdSl5bLYgmYvNY/G1rGglOY0p5ThMOet40UMQTa/nkRC2ZrQZ5UoMUoJhZWsyQCSLDGAeBJBjlCeRESJKu4io4TPEHh+F5WPsUPWSTm4QfxcxCmmefMqYUGx61YJ/suQBzxljHg1yxDfJYm3zulhkAGidNDCLSBPjn1+8sOyzvkHvIE/QNoGpw8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMTAtMzBUMDc6NTQ6NTcrMDA6MDClwVh6AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTEwLTMwVDA3OjU0OjU3KzAwOjAw1JzgxgAAAABJRU5ErkJggg==",
};

export const Toast = () => {
  const {
    hide,
    loading,
    type = "default",
    dismissible = true,
    onPress,
    text,
  } = useToast<ToastProperties>();
  useAutoHide();

  const _onPress = useCallback(() => {
    if (onPress) onPress();
    if (dismissible) hide();
  }, [onPress, dismissible]);

  return useMemo(
    () => (
      <Swipeable onSwipe={hide} disabled={loading || !dismissible}>
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={loading || !dismissible}
            style={[
              styles.touchable,
              {
                backgroundColor: ToastColors[type],
              },
            ]}
            onPress={_onPress}
          >
            {type !== "default" && (
              <Image
                source={{ uri: ToastIcons[type] }}
                resizeMode="contain"
                style={styles.icon}
              />
            )}
            <Text style={styles.text}>{text}</Text>
            {loading && <ActivityIndicator size="small" color="#fff" />}
          </TouchableOpacity>
        </View>
      </Swipeable>
    ),

    [loading],
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  touchable: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    padding: 10,
    minHeight: 48,
  },
  text: {
    color: "#ffffff",
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
