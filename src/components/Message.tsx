import type { Message as TMessage } from "../types";
import { type FC, memo, useId, useState } from "react";
import { View } from "react-native";
import {
  Button,
  IconButton,
  Menu,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useAudio, useAuth } from "../context";
import { MaterialIcons } from "@expo/vector-icons";
import useEffectOnce from "react-use/lib/useEffectOnce";

function Audio({ message }: { message: string }) {
  const id = useId();
  const { sounds, soundsStatus, initSound, clearSound } = useAudio()!;

  useEffectOnce(() => {
    initSound(id, message);
    return () => {
      clearSound(id);
    };
  });

  return (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <IconButton
        icon={(props) => (
          <MaterialIcons
            {...props}
            name={
              soundsStatus[id] && soundsStatus[id].isPlaying
                ? "pause"
                : "play-arrow"
            }
          />
        )}
        onPress={async () => {
          if (soundsStatus[id].isPlaying) await sounds[id].pauseAsync();

          return soundsStatus[id].positionMillis <
            soundsStatus[id].durationMillis!
            ? sounds[id].playAsync()
            : sounds[id].replayAsync(soundsStatus[id]);
        }}
      />
      <Text style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {soundsStatus[id]
          ? `${soundsStatus[id].positionMillis / 1000} / ${soundsStatus[id].durationMillis! / 1000}`
          : "0 / 0"}
      </Text>
    </View>
  );
}

const Message: FC<Props> = ({ receiver, message, type }) => {
  const { user } = useAuth()!;
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <TouchableRipple
      style={{ width: "100%", marginVertical: 5 }}
      onLongPress={() => setOpenMenu(true)}
    >
      {/* <Menu visible={openMenu} onDismiss={() => setOpenMenu(false)}>
        <Menu.Item title="delete" />
      </Menu> */}
      <View
        style={{
          maxWidth: "90%",
          marginHorizontal: 10,
          alignSelf: user!.id === receiver ? "flex-start" : "flex-end",
        }}
      >
        {type === "audio" ? (
          <Audio message={message} />
        ) : (
          <Button mode="elevated">{message}</Button>
        )}
      </View>
    </TouchableRipple>
  );
};

type Props = TMessage;

export default memo(Message);
