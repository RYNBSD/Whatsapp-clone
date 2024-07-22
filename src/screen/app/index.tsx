import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useCamera } from "../../context";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const { open } = useCamera()!;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Whatsapp" />
        <Appbar.Action
          icon={(props) => (
            <MaterialIcons {...props} name="camera" size={24} onPress={open} />
          )}
        />
        <Appbar.Action
          icon={(props) => (
            <MaterialCommunityIcons {...props} name="dots-vertical" size={24} />
          )}
        />
      </Appbar.Header>
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={require("./Chats/index").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="chat" size={24} />;
            },
          }}
        />
        <Tab.Screen
          name="Calls"
          component={require("./Calls/index").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="call" size={24} />;
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={require("./Settings").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="settings" size={24} />;
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}
