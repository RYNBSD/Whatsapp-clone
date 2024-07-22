import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AudioProvider,
  CameraProvider,
  MediaLibraryProvider,
} from "../context";

const Stack = createNativeStackNavigator();

export default function Screen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <MediaLibraryProvider>
        <CameraProvider>
          <AudioProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="Auth"
                component={require("./auth/index").default}
              />
              <Stack.Screen
                name="App"
                component={require("./app/index").default}
              />
            </Stack.Navigator>
          </AudioProvider>
        </CameraProvider>
      </MediaLibraryProvider>
    </View>
  );
}
