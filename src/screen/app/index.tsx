import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={require("./Chat").default} />
      <Tab.Screen name="Setting" component={require("./Setting").default} />
    </Tab.Navigator>
  );
}
