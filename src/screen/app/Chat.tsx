// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { ScreenProps } from "../../types";
import { useEffect, useMemo, useState, useTransition } from "react";
import { View } from "react-native";
import {
  Appbar,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { getDocumentAsync } from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useSocket } from "../../context";
import { Image } from "expo-image";

export default function Chat({ navigation, route }: ScreenProps) {
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const { socket } = useSocket()!;

  useEffect(() => {
    if (trimmedMessage.length === 0) return;

    socket!.emit("typing");
  }, [socket, trimmedMessage.length]);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: theme.colors.background,
      }}
    >
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={`${BASE_URL}/${route.params!.user.image}`}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <View style={{ flexDirection: "column" }}>
                <Text variant="titleLarge">{route.params!.user.username}</Text>
                {isTyping && <Text variant="titleSmall">Typing...</Text>}
              </View>
            </View>
          }
        />
      </Appbar.Header>
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Searchbar
          style={{ flex: 1 }}
          value={message}
          onChangeText={(text) => {
            startTransition(() => {
              setMessage(text);
            });
          }}
          icon={() => null}
          right={(props) => (
            <IconButton
              {...props}
              icon={(props) => (
                <MaterialIcons
                  {...props}
                  name="attach-file"
                  onPress={async () => {
                    const document = await getDocumentAsync({ multiple: true });
                    if (document.canceled) return;
                  }}
                />
              )}
            />
          )}
        />
        {trimmedMessage.length === 0 ? (
          <IconButton
            mode="contained"
            icon={(props) => (
              <MaterialIcons {...props} name="mic" onPress={() => {}} />
            )}
          />
        ) : (
          <IconButton
            mode="contained"
            icon={(props) => (
              <MaterialIcons
                {...props}
                name="send"
                onPress={() => {
                  socket!.emit("message", { receiver: 0, message });
                  socket!.on("message", (args) => {
                    console.log(args);
                  });
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
