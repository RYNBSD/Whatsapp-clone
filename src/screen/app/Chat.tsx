import type { ScreenProps } from "../../types";
import { useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { usePreventScreenCapture } from "expo-screen-capture";
import { useAudio } from "../../context";
import { handleAsync } from "../../util";
import {
  ChatFooter,
  ChatHeader,
  ChatList,
  useMessage,
  useMessages,
} from "../../components/app/Chat";

export default function Chat({ route }: ScreenProps) {
  usePreventScreenCapture();
  const theme = useTheme();
  const { clearSounds } = useAudio()!;
  const messagesReset = useMessages((state) => state.reset);
  const messageReset = useMessage((state) => state.reset);

  useEffect(() => {
    return () => {
      handleAsync(() => clearSounds());
      messagesReset();
      messageReset();
    };
  }, [clearSounds, messageReset, messagesReset]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ChatHeader user={route.params!.user} />
      <ChatList user={route.params!.user} />
      <ChatFooter user={route.params!.user} />
    </View>
  );
}
