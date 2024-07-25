import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function Auth() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: safeAreaInsets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={require("./SignUp").default} />
        <Stack.Screen name="SignIn" component={require("./SignIn").default} />
      </Stack.Navigator>
    </View>
  );
}
