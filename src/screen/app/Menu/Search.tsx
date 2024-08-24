import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { useEffect, useState, useTransition } from "react";
import { Divider, Searchbar } from "react-native-paper";
import { FlatList, View } from "react-native";
import { create } from "zustand";
import { handleAsync, request } from "../../../util";
import { UserCard } from "../../../components";

const useSearch = create<{
  search: string;
  setSearch: (search: string) => void;
  reset: () => void;
}>((set) => ({
  search: "",
  setSearch: (search: string) => set({ search }),
  reset: () => set({ search: "" }),
}));

function SearchInput() {
  const [_isPending, startTransition] = useTransition();
  const search = useSearch((state) => state.search);
  const setSearch = useSearch((state) => state.setSearch);

  return (
    <Searchbar
      mode="view"
      placeholder="Search"
      value={search}
      onChangeText={(text) => {
        startTransition(() => {
          const trimmed = text.trimStart();
          if ((trimmed.length === 0 && text.length > 0) || trimmed === search)
            return;
          setSearch(trimmed);
        });
      }}
    />
  );
}

function SearchList() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const search = useSearch((state) => state.search);

  useEffect(() => {
    if (search.length === 0) return;
    const controller = new AbortController();

    handleAsync(async () => {
      const res = await request(
        `/user/search?q=${encodeURIComponent(search)}`,
        { signal: controller.signal }
      );
      if (!res.ok || res.status === 204) return;

      const json = await res.json();
      setUsers(json.data.users);
    });

    return () => {
      controller.abort();
    };
  }, [search]);

  return (
    <FlatList
      data={users}
      renderItem={({ item, index }) => (
        <>
          {/* @ts-ignore */}
          <UserCard
            {...item}
            onPress={() =>
              navigation.navigate("App", {
                screen: "Chat",
                params: { user: item },
              })
            }
          />
          {index !== users.length - 1 && <Divider />}
        </>
      )}
      // keyExtractor={(item) => item.id}
    />
  );
}

export default function Search() {
  const reset = useSearch((state) => state.reset);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <View style={{ flex: 1 }}>
      <SearchInput />
      <SearchList />
    </View>
  );
}
