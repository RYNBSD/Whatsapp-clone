// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { Message as TMessage } from "../types";
import { type FC, memo, useId, useState } from "react";
import { Alert, View } from "react-native";
import { Button, IconButton, Text, TouchableRipple } from "react-native-paper";
import { Image } from "expo-image";
import { Video as ExpoVideo } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { documentDirectory, downloadAsync } from "expo-file-system";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { useAudio, useAuth, useMediaLibrary } from "../context";
import { handleAsync, millis2time } from "../util";

// TODO: Fix audio load and unload
function Audio({ message }: { message: string }) {
  const id = useId();
  const { soundsStatus, initSound, playSound } = useAudio()!;

  useEffectOnce(() => {
    handleAsync(() => initSound(id, message));
  });

  return (
    <Button mode="elevated">
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          onPress={() => handleAsync(() => playSound(id))}
        />
        <Text>
          {soundsStatus[id]
            ? `${millis2time(soundsStatus[id].positionMillis)} / ${millis2time(soundsStatus[id].durationMillis ?? 0)}`
            : "0 / 0"}
        </Text>
      </View>
    </Button>
  );
}

function Img({ message }: { message: string }) {
  return (
    <Image
      source={`${BASE_URL}/${message}`}
      style={{ width: 200, height: 200 }}
    />
  );
}

function Video({ message }: { message: string }) {
  return (
    <View style={{ width: 200, height: 200 }}>
      <ExpoVideo
        style={{ width: "100%", height: "100%" }}
        source={{ uri: `${BASE_URL}/${message}` }}
        useNativeControls
      />
    </View>
  );
}

function File({ message }: { message: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { storeAsset } = useMediaLibrary()!;
  return (
    <Button mode="elevated">
      <IconButton
        icon={(props) => (
          <MaterialIcons
            {...props}
            name={isDownloading ? "downloading" : "download"}
          />
        )}
        onPress={async () => {
          await handleAsync(
            async () => {
              setIsDownloading(true);
              const filename = message.split("\\")[1];
              const res = await downloadAsync(
                `${BASE_URL}/${message}`,
                documentDirectory + filename,
              );
              await storeAsset(res.uri, filename, res.headers["Content-Type"]);
            },
            null,
            () => Alert.alert("Error", "Can't download file"),
            () => setIsDownloading(false),
          );
        }}
      />
    </Button>
  );
}

const Message: FC<Props> = ({ sender, receiver, message, type }) => {
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
        ) : type === "image" ? (
          <Img message={message} />
        ) : type === "video" ? (
          <Video message={message} />
        ) : type === "file" ? (
          <File message={message} />
        ) : (
          <Button mode="elevated">{message}</Button>
        )}
        {/* <Text>Seen</Text> */}
      </View>
    </TouchableRipple>
  );
};

type Props = TMessage;

export default memo(Message);
