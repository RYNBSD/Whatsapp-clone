import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { type ReactNode, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Appbar, Menu } from "react-native-paper";
import { useAuth, useCamera } from "../../../context";
import { handleAsync } from "../../../util";

const BottomTap = createMaterialBottomTabNavigator();

function SignOutMenuItem() {
  const [disabled, setDisabled] = useState(false);
  const { signOut } = useAuth()!;
  return (
    <Menu.Item
      disabled={disabled}
      title="Sign out"
      onPress={() =>
        handleAsync(async () => {
          setDisabled(false);
          await signOut();
        }).finally(() => setDisabled(true))
      }
    />
  );
}

function AppBarMenu({ children }: { children: ReactNode }) {
  const safeAreaInsets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      style={{ paddingTop: safeAreaInsets.top }}
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Appbar.Action
          icon={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="dots-vertical"
              size={24}
              onPress={() => setVisible(true)}
            />
          )}
        />
      }
    >
      {children}
    </Menu>
  );
}

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
        <AppBarMenu>
          <SignOutMenuItem />
        </AppBarMenu>
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
