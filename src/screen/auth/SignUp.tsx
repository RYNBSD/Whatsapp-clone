import { useCallback, useState, useTransition } from "react";
import { Alert, View } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Card,
  HelperText,
  TouchableRipple,
} from "react-native-paper";
import {
  type ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { Image } from "expo-image";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isEmpty from "validator/lib/isEmpty";
import isStrongPassword from "validator/lib/isStrongPassword";
import { ScreenProps } from "../../types";
import { useAuth } from "../../context";
import { handleAsync, object2formData } from "../../util";

export default function SignUp({ navigation }: Props) {
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [fields, setFields] = useState({
    username: "",
    email: "",
    country: "",
    phone: "",
    password: "",
  });

  const { signUp } = useAuth()!;

  const onChangeText = useCallback((name: string, text: string) => {
    startTransition(() => {
      setFields((prev) => ({ ...prev, [name]: text }));
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 25,
        backgroundColor: theme.colors.background,
      }}
    >
      <Card
        mode="contained"
        style={{
          width: "100%",
          backgroundColor: theme.colors.background,
        }}
      >
        <Card.Title title="Sign up" titleVariant="headlineLarge" />
        <Card.Content>
          <View style={{ width: "100%", alignItems: "center" }}>
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
                source={image?.uri ?? require("../../../assets/profile.png")}
                style={{ width: 150, height: 150, borderRadius: 75 }}
                contentFit="cover"
              />
            </TouchableRipple>
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              mode="outlined"
              label="Username"
              value={fields.username}
              onChangeText={(text) => onChangeText("username", text)}
            />
            <HelperText type="error" visible={isEmpty(fields.username)}>
              Username required!
            </HelperText>
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              mode="outlined"
              label="Email"
              value={fields.email}
              onChangeText={(text) => onChangeText("email", text)}
            />
            <HelperText type="error" visible={!isEmail(fields.email)}>
              Email address is invalid!
            </HelperText>
          </View>
          <View style={{ width: "100%" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                mode="outlined"
                style={{ width: "30%" }}
                label="Country"
                value={fields.country}
                onChangeText={(text) => onChangeText("country", text)}
              />
              <TextInput
                mode="outlined"
                style={{ width: "65%" }}
                label="Phone"
                value={fields.phone}
                onChangeText={(text) => onChangeText("phone", text)}
              />
            </View>
            <HelperText
              type="error"
              visible={!isMobilePhone(`${fields.country}${fields.phone}`)}
            >
              Phone number is invalid!
            </HelperText>
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              mode="outlined"
              label="Password"
              value={fields.password}
              secureTextEntry
              onChangeText={(text) => onChangeText("password", text)}
            />
            <HelperText
              type="info"
              visible={!isStrongPassword(fields.password)}
            >
              Put strong password!
            </HelperText>
          </View>
        </Card.Content>
        <Card.Actions style={{ flexDirection: "column", gap: 10 }}>
          <Button
            mode="contained"
            style={{ width: "100%", borderRadius: 12 }}
            onPress={async () => {
              await handleAsync(async () => {
                if (image === null) {
                  Alert.alert("Missing", "Make sure to add image");
                  return;
                }

                const formData = object2formData({
                  ...fields,
                  phone: fields.country + fields.phone,
                });

                // @ts-ignore
                formData.append("image", {
                  uri: image.uri,
                  name: "image.png",
                  type: image.mimeType,
                });

                await signUp(formData);
              });
            }}
          >
            Submit
          </Button>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              Sign in
            </Button>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
}

type Props = ScreenProps;
