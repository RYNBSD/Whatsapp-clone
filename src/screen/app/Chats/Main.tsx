import { FlatList, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { ScreenProps } from "../../../types";
import { UserCard } from "../../../components";

const chats = [
  {
    image:
      "https://cdn.pixabay.com/photo/2024/04/21/14/13/pelican-8710717_1280.jpg",
    username: "username",
    lastMessage: "last message",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2024/04/21/14/13/pelican-8710717_1280.jpg",
    username: "username",
    lastMessage: "last message",
  },
];

export default function Chats({ navigation }: ScreenProps) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <UserCard
            {...item}
            onPress={() => {
              navigation.navigate("Chat");
            }}
          />
        )}
      />
    </View>
  );
}
