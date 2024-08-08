import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context";

const Stack = createNativeStackNavigator();

export default function Screen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const { user } = useAuth()!;

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
        paddingBottom: safeAreaInsets.bottom,
        backgroundColor: theme.colors.background,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user === null ? (
          <Stack.Screen
            name="Auth"
            component={require("./auth/index").default}
          />
        ) : (
          <Stack.Screen name="App" component={require("./app/index").default} />
        )}
      </Stack.Navigator>
    </View>
  );
}
