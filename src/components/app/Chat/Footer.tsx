import type { User } from "../../../types";
import { Alert, View } from "react-native";
import { IconButton, Searchbar, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { getDocumentAsync } from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system";
import { memo, useTransition } from "react";
import { Buffer } from "buffer";
import { handleAsync, millis2time } from "../../../util";
import { useAudio, useSocket } from "../../../context";
import { useMessage } from "./store";

function VoiceTimer() {
  const { recordingStatus } = useAudio()!;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{millis2time(recordingStatus!.durationMillis)}</Text>
    </View>
  );
}

function MessageInput({ user }: { user: User }) {
  const [_isPending, startTransition] = useTransition();
  const { message, setMessage } = useMessage();
  const { socket } = useSocket()!;

  return (
    <Searchbar
      style={{ flex: 1 }}
      value={message}
      onChangeText={(text) => {
        startTransition(() => {
          const trimmed = text.trimStart();
          socket.emit("typing", {
            to: user.id,
            length: trimmed.length,
          });
          if (trimmed.length === 0 && text.length > 0) return;
          setMessage(trimmed);
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
                      const base64 = await readAsStringAsync(document.uri, {
                        encoding: "base64",
                      });
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
                    }),
                  );
                  files.forEach((file) => {
                    socket.volatile.emit("message", {
                      to: user.id,
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
  );
}

function ChatInput({ user }: { user: User }) {
  const { recordingStatus } = useAudio()!;
  return recordingStatus !== null && recordingStatus.isRecording ? (
    <VoiceTimer />
  ) : (
    <MessageInput user={user} />
  );
}

function SendIcon({ user }: { user: User }) {
  const { message, setMessage } = useMessage();
  const { socket } = useSocket()!;

  return (
    <IconButton
      mode="contained"
      icon={(props) => (
        <MaterialIcons
          {...props}
          name="send"
          onPress={async () => {
            socket.volatile.emit("message", {
              to: user.id,
              message: Buffer.from(message),
              type: "text",
            });
            setMessage("");
          }}
        />
      )}
    />
  );
}

function MicIcon({ user }: { user: User }) {
  const { startRecording, stopRecording } = useAudio()!;
  const { socket } = useSocket()!;

  return (
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
                to: user.id,
                message: buffer,
                type: "audio",
              });
            });
          }}
        />
      )}
    />
  );
}

function ChatAction({ user }: { user: User }) {
  const { message } = useMessage();
  return message.length === 0 ? (
    <MicIcon user={user} />
  ) : (
    <SendIcon user={user} />
  );
}

function ChatFooter({ user }: { user: User }) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <ChatInput user={user} />
      <ChatAction user={user} />
    </View>
  );
}

export default memo(ChatFooter);
