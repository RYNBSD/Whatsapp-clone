import { useState, useTransition } from "react";
import { View } from "react-native";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function Chat() {
  const [_isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 5,
        }}
      >
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
              icon={(props) => <MaterialIcons {...props} name="attach-file" />}
            />
          )}
        />
        {message.length === 0 ? (
          <IconButton
            icon={(props) => (
              <MaterialIcons {...props} name="mic" onPress={() => {}} />
            )}
          />
        ) : (
          <IconButton
            icon={(props) => (
              <MaterialIcons {...props} name="send" onPress={() => {}} />
            )}
          />
        )}
      </View>
    </View>
  );
}