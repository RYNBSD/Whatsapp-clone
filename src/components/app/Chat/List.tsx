import type { User, Message as TMessage } from "../../../types";
import { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { handleAsync, isCloseToBottom, request } from "../../../util";
import { useSocket } from "../../../context";
import { useMessages } from "./store";
import Message from "../../Message";

export default function ChatList({ user }: { user: User }) {
  const { messages, setMessages } = useMessages();
  const { socket } = useSocket()!;

  const getMessages = useCallback(
    async (init?: RequestInit) => {
      const res = await request(
        `/user/messages?receiverId=${encodeURIComponent(user.id)}${
          messages.length > 0
            ? `&lastId=${encodeURIComponent(messages[messages.length - 1].id)}`
            : ""
        }`,
        init,
      );
      if (!res.ok || res.status === 204) return;

      const json = await res.json();
      const jsonMessages = json.data.messages as TMessage[];
      setMessages((prev) => prev.concat(jsonMessages));
    },
    [messages, setMessages, user.id],
  );

  useEffectOnce(() => {
    const controller = new AbortController();

    handleAsync(() => getMessages());

    return () => {
      controller.abort();
    };
  });

  useEffect(() => {
    const messageCallback = (arg: TMessage) => {
      setMessages((prev) => [arg, ...prev]);
    };
    socket.on("message", messageCallback);

    const seenCallback = (arg: { messageId: number }) => {
      setMessages((prev) =>
        prev.map((message) => {
          if (message.id === arg.messageId) message.seen = true;
          return message;
        }),
      );
    };
    socket.on("seen", seenCallback);

    return () => {
      socket.off("message", messageCallback);
      socket.off("seen", seenCallback);
    };
  }, [setMessages, socket]);

  return (
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
  );
}
