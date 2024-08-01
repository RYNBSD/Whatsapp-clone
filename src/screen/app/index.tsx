import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={require("./Menu/index").default} />
      <Stack.Screen name="Chat" component={require("./Chat").default} />
    </Stack.Navigator>
  );
}
