import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useAudio, useCamera, useMediaLibrary } from "../../context";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const { open, checkPermission: checkCameraPermission } = useCamera()!;
  const { checkPermission: checkAudioPermission } = useAudio()!;
  const { checkPermission: checkMediaLibraryPermission } = useMediaLibrary()!;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Whatsapp" />
        <Appbar.Action
          icon={(props) => (
            <MaterialIcons
              {...props}
              name="camera"
              size={24}
              onPress={async () => {
                const isCameraAllowed = await checkCameraPermission();
                const isAudioAllowed = await checkAudioPermission();
                const isMediaLibraryAllowed =
                  await checkMediaLibraryPermission();
                if (isCameraAllowed && isAudioAllowed && isMediaLibraryAllowed)
                  open();
              }}
            />
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
          name="Search"
          component={require("./Search").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="search" size={24} />;
            },
          }}
        />
        <Tab.Screen
          name="Portfolio"
          component={require("./Portfolio").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="person" size={24} />;
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}
