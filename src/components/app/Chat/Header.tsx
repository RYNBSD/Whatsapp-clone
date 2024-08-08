// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { User } from "../../../types";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { memo, useEffect, useState } from "react";
import { Appbar, Badge, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Image } from "expo-image";
import { useSocket } from "../../../context";

function ChatHeaderTyping({ user }: { user: User }) {
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket()!;

  useEffect(() => {
    const callback = (args: { from: number; length: number }) => {
      if (args.from === user.id) setIsTyping(args.length > 0);
    };
    socket.on("typing", callback);

    return () => {
      socket.off("typing", callback);
    };
  }, [socket, user.id]);

  return isTyping ? <Text variant="titleSmall">Typing...</Text> : null;
}

function ChatHeaderBadge({ user }: { user: User }) {
  const { connectedContacts } = useSocket()!;
  return (
    <Badge
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: connectedContacts.includes(user.id) ? "green" : "red",
      }}
      size={10}
    />
  );
}

function ChatHeader({ user }: { user: User }) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Appbar.Header elevated>
      <Appbar.BackAction
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("App", { screen: "Menu" })
        }
      />
      <Appbar.Content
        title={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={`${BASE_URL}/${user.image}`}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <ChatHeaderBadge user={user} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text variant="titleLarge">{user.username}</Text>
              <ChatHeaderTyping user={user} />
            </View>
          </View>
        }
      />
      <Appbar.Action
        icon={(props) => <MaterialIcons {...props} name="call" />}
      />
    </Appbar.Header>
  );
}

export default memo(ChatHeader);
