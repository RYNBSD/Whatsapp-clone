import { useEffect, useState, useTransition } from "react";
import { FlatList, View } from "react-native";
import { Divider, Searchbar } from "react-native-paper";
import { request } from "../../util";
import { UserCard } from "../../components";

export default function Search() {
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");
  const [_isPending, startTransition] = useTransition();

  useEffect(() => {
    if (search.length === 0) return;

    const controller = new AbortController();
    (async () => {
      const res = await request(
        `/user/search?q=${encodeURIComponent(search)}`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data.users);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [search]);

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        mode="view"
        placeholder="Search"
        value={search}
        onChangeText={(text) => {
          startTransition(() => {
            setSearch(text);
          });
        }}
      />
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <>
            {/* @ts-ignore */}
            <UserCard {...item} />
            {index !== users.length - 1 && <Divider />}
          </>
        )}
      />
    </View>
  );
}
