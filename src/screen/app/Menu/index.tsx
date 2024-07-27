import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useCamera } from "../../../context";

const BottomTap = createMaterialBottomTabNavigator();

export default function App() {
  const { open, checkPermission: checkCameraPermission } = useCamera()!;
  // const { checkPermission: checkAudioPermission } = useAudio()!;
  // const { checkPermission: checkMediaLibraryPermission } = useMediaLibrary()!;

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
                // const isAudioAllowed = await checkAudioPermission();
                // const isMediaLibraryAllowed =
                //   await checkMediaLibraryPermission();
                if (isCameraAllowed) open();
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
      <BottomTap.Navigator>
        <BottomTap.Screen
          name="Chats"
          component={require("./Chats").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="chat" size={24} />;
            },
          }}
        />
        <BottomTap.Screen
          name="Calls"
          component={require("./Calls").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="call" size={24} />;
            },
          }}
        />
        <BottomTap.Screen
          name="Search"
          component={require("./Search").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="search" size={24} />;
            },
          }}
        />
        <BottomTap.Screen
          name="Profile"
          component={require("./Profile").default}
          options={{
            tabBarIcon(props) {
              return <MaterialIcons {...props} name="person" size={24} />;
            },
          }}
        />
      </BottomTap.Navigator>
    </>
  );
}
