// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import { View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import isEmpty from "validator/lib/isEmpty";
import { Image } from "expo-image";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context";
import { handleAsync } from "../../../util";
import { useImagePicker } from "../../../hook";

function ImagePicker() {
  const theme = useTheme();
  const { user } = useAuth()!;
  const image = useImagePicker((state) => state.image);
  const setImage = useImagePicker((state) => state.setImage);

  return (
    <TouchableRipple
      rippleColor={theme.colors.background}
      onPress={async () => {
        await handleAsync(async () => {
          const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled) setImage(result.assets[0]);
        });
      }}
    >
      <Image
        source={image !== null ? image.uri : `${BASE_URL}/${user!.image}`}
        style={{ width: 150, height: 150, borderRadius: 75 }}
        contentFit="cover"
      />
    </TouchableRipple>
  );
}

function UsernameInput() {
  const { user, onChangeText } = useAuth()!;
  return (
    <TextInput
      mode="outlined"
      label="Username"
      value={user!.username}
      onChangeText={(text) => {
        onChangeText("username", text);
      }}
    />
  );
}

function UpdateButton() {
  const { update } = useAuth()!;
  const [disabled, setDisabled] = useState(false);
  const image = useImagePicker((state) => state.image);
  const reset = useImagePicker((state) => state.reset);
  return (
    <Button
      disabled={disabled}
      onPress={async () => {
        await handleAsync(async () => {
          setDisabled(true);
          await update(image);
          reset();
        }).finally(() => setDisabled(false));
      }}
    >
      Update
    </Button>
  );
}

function DeleteButton() {
  const { remove } = useAuth()!;
  const [disabled, setDisabled] = useState(false);
  return (
    <Button
      disabled={disabled}
      onPress={() =>
        handleAsync(async () => {
          setDisabled(true);
          await remove();
        }).finally(() => setDisabled(false))
      }
    >
      Delete
    </Button>
  );
}

export default function Profile() {
  const theme = useTheme();
  const { user } = useAuth()!;
  const reset = useImagePicker((state) => state.reset);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <View style={{ flex: 1 }}>
      <Card
        mode="contained"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Card.Content>
          <View style={{ width: "100%", alignItems: "center" }}>
            <ImagePicker />
          </View>
          <View style={{ width: "100%" }}>
            <UsernameInput />
            <HelperText type="error" visible={isEmpty(user!.username)}>
              Username required!
            </HelperText>
          </View>
          <View>
            <TextInput
              editable={false}
              mode="outlined"
              label="Email"
              value={user!.email}
            />
            <HelperText type="error" visible={false}>
              Email address is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              editable={false}
              mode="outlined"
              label="Phone"
              value={user!.phone}
            />
            <HelperText type="error" visible={false}>
              Phone number is invalid!
            </HelperText>
          </View>
        </Card.Content>
        <Card.Actions>
          <DeleteButton />
          <UpdateButton />
        </Card.Actions>
      </Card>
    </View>
  );
}
