import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Auth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={require("./SignUp").default} />
      <Stack.Screen name="SignIn" component={require("./SignIn").default} />
    </Stack.Navigator>
  );
}
