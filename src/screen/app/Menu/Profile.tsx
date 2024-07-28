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
import {
  type ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { useState } from "react";
import { useAuth } from "../../../context";

export default function Profile() {
  const theme = useTheme();
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const { user, onChangeText, update, remove } = useAuth()!;

  return (
    <View style={{ flex: 1 }}>
      <Card
        mode="contained"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Card.Content>
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableRipple
              rippleColor={theme.colors.background}
              onPress={async () => {
                const result = await launchImageLibraryAsync({
                  mediaTypes: MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                });
                if (!result.canceled) setImage(result.assets[0]);
              }}
            >
              <Image
                source={
                  image !== null ? image.uri : `${BASE_URL}/${user!.image}`
                }
                style={{ width: 150, height: 150, borderRadius: 75 }}
                contentFit="cover"
              />
            </TouchableRipple>
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              mode="outlined"
              label="Username"
              value={user!.username}
              onChangeText={(text) => onChangeText("username", text)}
            />
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
          <Button onPress={remove}>Delete</Button>
          <Button
            onPress={async () => {
              await update(image);
              setImage(null);
            }}
          >
            Update
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
