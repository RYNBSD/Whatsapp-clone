// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { Message as TMessage, ScreenProps } from "../../types";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  Appbar,
  Badge,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { usePreventScreenCapture } from "expo-screen-capture";
import { getDocumentAsync } from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Buffer } from "buffer";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { useAudio, useSocket } from "../../context";
import { request } from "../../util";
import { Message } from "../../components";

export default function Chat({ navigation, route }: ScreenProps) {
  usePreventScreenCapture();
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [message, setMessage] = useState("");
  const { socket } = useSocket()!;
  const { recordingStatus, startRecording, stopRecording } = useAudio()!;

  const trimmedMessage = useMemo(() => {
    const trim = message.trim();
    socket!.emit("typing", { to: route.params!.user.id, length: trim.length });
    return trim;
  }, [message, route.params, socket]);

  useEffectOnce(() => {
    const controller = new AbortController();

    (async () => {
      const res = await request(
        `/user/messages?receiverId=${encodeURIComponent(route.params!.user.id)}${
          messages.length > 0
            ? `&lastId=${encodeURIComponent(messages[messages.length - 1].id)}`
            : ""
        }`,
        {
          signal: controller.signal,
        },
      );
      if (!res.ok || res.status === 204) return;

      const json = await res.json();
      setMessages((prev) => prev.concat(json.data.messages));
    })();

    return () => {
      controller.abort();
    };
  });

  useEffect(() => {
    const callback = (arg: TMessage) => {
      setMessages((prev) => [...prev, arg]);
    };

    socket!.on("message", callback);

    return () => {
      socket!.off("message", callback);
    };
  }, [socket]);

  useEffect(() => {
    const callback = (args: { from: number; length: number }) => {
      if (args.from === route.params!.user.id) setIsTyping(args.length > 0);
    };

    socket!.on("typing", callback);

    return () => {
      socket!.off("typing", callback);
    };
  }, [route.params, socket]);

  return (
    <View
      style={{
        flex: 1,
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
              <View style={{ position: "relative" }}>
                <Image
                  source={`${BASE_URL}/${route.params!.user.image}`}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <Badge
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: isConnected ? "green" : "red",
                  }}
                  size={10}
                />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text variant="titleLarge">{route.params!.user.username}</Text>
                {isTyping && <Text variant="titleSmall">Typing...</Text>}
              </View>
            </View>
          }
        />
      </Appbar.Header>
      <FlatList
        style={{ flex: 1 }}
        data={messages}
        renderItem={({ item }) => <Message {...item} />}
        keyExtractor={(item) => `${item.id}`}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {recordingStatus !== null && recordingStatus.isRecording ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>{recordingStatus.durationMillis / 1000} seconds</Text>
          </View>
        ) : (
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
                      const document = await getDocumentAsync({
                        multiple: true,
                      });
                      if (document.canceled) return;
                    }}
                  />
                )}
              />
            )}
          />
        )}
        {trimmedMessage.length === 0 ? (
          <IconButton
            mode="contained"
            icon={(props) => (
              <MaterialIcons
                {...props}
                name="mic"
                onLongPress={startRecording}
                onPressOut={async () => {
                  const base64 = await stopRecording();
                  if (base64 === null)
                    return Alert.alert("Error", "Can't record your voice");

                  const buffer = Buffer.from(base64, "base64");
                  socket!.emit("message", {
                    to: route.params!.user.id,
                    message: buffer,
                    type: "audio",
                  });
                }}
              />
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
                  socket!.emit("message", {
                    to: route.params!.user.id,
                    message: Buffer.from(message),
                    type: "text",
                  });
                  setMessage("");
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
