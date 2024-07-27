import type { ScreenProps } from "../../types";
import { useState, useTransition } from "react";
import { View } from "react-native";
import { Appbar, IconButton, Searchbar, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function Chat({ navigation }: ScreenProps) {
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: theme.colors.background,
      }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="test" />
      </Appbar.Header>
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
