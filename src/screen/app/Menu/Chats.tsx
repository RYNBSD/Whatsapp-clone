import type { ScreenProps, User } from "../../../types";
import { useState } from "react";
import { FlatList } from "react-native";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { handleAsync, request } from "../../../util";
import { UserCard } from "../../../components";
import { Divider } from "react-native-paper";

export default function Chats({ navigation }: Props) {
  const [chats, setChats] = useState<User[]>([]);

  useEffectOnce(() => {
    const controller = new AbortController();
    handleAsync(async () => {
      const res = await request("/user/chats", { signal: controller.signal });
      if (!res.ok || res.status === 204) return;

      const json = await res.json();
      setChats(json.data.chats);
    });
    return () => {
      controller.abort();
      setChats([]);
    };
  });

  return (
    <FlatList
      data={chats}
      renderItem={({ item, index }) => (
        <>
          {/* @ts-ignore */}
          <UserCard
            {...item}
            onPress={() => {
              navigation.navigate("App", {
                screen: "Chat",
                params: { user: item },
              });
            }}
          />
          {index !== chats.length - 1 && <Divider />}
        </>
      )}
      keyExtractor={(item) => `${item.id}`}
    />
  );
}

type Props = ScreenProps;
