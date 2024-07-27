import { Text, FlatList } from "react-native";

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

export default function Chats() {
  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => <Text>{item.username}</Text>}
    />
  );
}
