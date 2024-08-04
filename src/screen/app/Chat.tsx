// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { Message as TMessage, ScreenProps } from "../../types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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
import { readAsStringAsync } from "expo-file-system";
import { Buffer } from "buffer";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { useAudio, useSocket } from "../../context";
import { handleAsync, isCloseToBottom, millis2time, request } from "../../util";
import { Message } from "../../components";

export default function Chat({ navigation, route }: ScreenProps) {
  usePreventScreenCapture();
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [message, setMessage] = useState("");
  const { socket, connectedContacts } = useSocket()!;
  const { recordingStatus, startRecording, stopRecording, clearSounds } =
    useAudio()!;

  const trimmedMessage = useMemo(() => {
    const trim = message.trim();
    socket.volatile.emit("typing", {
      to: route.params!.user.id,
      length: trim.length,
    });
    return trim;
  }, [message, route.params, socket]);

  const getMessages = useCallback(
    async (init?: RequestInit) => {
      const res = await request(
        `/user/messages?receiverId=${encodeURIComponent(route.params!.user.id)}${
          messages.length > 0
            ? `&lastId=${encodeURIComponent(messages[messages.length - 1].id)}`
            : ""
        }`,
        init
      );
      if (!res.ok || res.status === 204) return;

      const json = await res.json();
      const jsonMessages = json.data.messages as TMessage[];
      setMessages((prev) => prev.concat(jsonMessages));
    },
    [messages, route.params]
  );

  useEffectOnce(() => {
    const controller = new AbortController();

    handleAsync(async () => {
      await getMessages({
        signal: controller.signal,
      });
    });

    return () => {
      controller.abort();
    };
  });

  useEffect(() => {
    const messageCallback = (arg: TMessage) => {
      setMessages((prev) => [arg, ...prev]);
    };
    socket.on("message", messageCallback);

    const typingCallback = (args: { from: number; length: number }) => {
      if (args.from === route.params!.user.id) setIsTyping(args.length > 0);
    };
    socket.on("typing", typingCallback);

    const seenCallback = (arg: { messageId: number }) => {
      console.log(arg);
      setMessages((prev) => ({
        ...prev.map((message) => {
          if (message.id === arg.messageId) message.seen = true;
          return message;
        }),
      }));
    };
    socket.on("seen", seenCallback);

    return () => {
      handleAsync(() => clearSounds());
      socket.off("typing", typingCallback);
      socket.off("message", messageCallback);
      socket.off("seen", seenCallback);
    };
  }, [clearSounds, route.params, socket]);

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
                    backgroundColor: connectedContacts.includes(
                      route.params!.user.id
                    )
                      ? "green"
                      : "red",
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
        <Appbar.Action
          icon={(props) => <MaterialIcons {...props} name="call" />}
          onPress={() => {}}
        />
      </Appbar.Header>
      <FlatList
        style={{ flex: 1 }}
        data={messages}
        renderItem={({ item }) => <Message {...item} />}
        keyExtractor={(item) => `${item.id}`}
        inverted
        onScroll={async ({ nativeEvent }) => {
          if (!isCloseToBottom(nativeEvent)) return;
          handleAsync(async () => {
            await getMessages();
          });
        }}
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
            <Text>{millis2time(recordingStatus.durationMillis)}</Text>
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
                      await handleAsync(async () => {
                        const documents = await getDocumentAsync({
                          multiple: true,
                        });
                        if (documents.canceled) return;

                        const files = await Promise.all(
                          documents.assets.map(async (document) => {
                            const base64 = await readAsStringAsync(
                              document.uri,
                              {
                                encoding: "base64",
                              }
                            );
                            const buffer = Buffer.from(base64, "base64");
                            return {
                              buffer,
                              type: document.mimeType?.startsWith("image")
                                ? "image"
                                : document.mimeType?.startsWith("video")
                                  ? "video"
                                  : document.mimeType?.startsWith("audio")
                                    ? "audio"
                                    : "file",
                            };
                          })
                        );

                        files.forEach((file) => {
                          socket.volatile.emit("message", {
                            to: route.params!.user.id,
                            message: file.buffer,
                            type: file.type,
                          });
                        });
                      });
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
                onLongPress={() => handleAsync(() => startRecording())}
                onPressOut={async () => {
                  await handleAsync(async () => {
                    const base64 = await stopRecording();
                    if (base64 === null)
                      return Alert.alert("Error", "Can't record your voice");

                    const buffer = Buffer.from(base64, "base64");
                    socket.volatile.emit("message", {
                      to: route.params!.user.id,
                      message: buffer,
                      type: "audio",
                    });
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
                onPress={async () => {
                  socket.volatile.emit("message", {
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
