import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Chats() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={require("./Main").default} />
      <Stack.Screen name="Chat" component={require("./Chat").default} />
    </Stack.Navigator>
  );
}
