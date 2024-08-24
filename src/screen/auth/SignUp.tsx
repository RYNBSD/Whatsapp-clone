import { useEffect, useState, useTransition } from "react";
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
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { Image } from "expo-image";
import { create } from "zustand";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isEmpty from "validator/lib/isEmpty";
import isStrongPassword from "validator/lib/isStrongPassword";
import { ScreenProps } from "../../types";
import { useAuth } from "../../context";
import { handleAsync, object2formData } from "../../util";
import { useImagePicker } from "../../hook";

type Fields = {
  username: string;
  email: string;
  country: string;
  phone: string;
  password: string;
};

const useFields = create<
  {
    setFields: (key: keyof Fields, text: string) => void;
    reset: () => void;
  } & Fields
>((set) => ({
  username: "",
  email: "",
  country: "",
  phone: "",
  password: "",
  setFields: (key: keyof Fields, text: string) => set({ [key]: text }),
  reset: () =>
    set({
      username: "",
      email: "",
      country: "",
      phone: "",
      password: "",
    }),
}));

function ImagePicker() {
  const theme = useTheme();
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
        source={image?.uri ?? require("../../../assets/profile.png")}
        style={{ width: 150, height: 150, borderRadius: 75 }}
        contentFit="cover"
      />
    </TouchableRipple>
  );
}

function UsernameField() {
  const [_isPending, startTransition] = useTransition();
  const username = useFields((state) => state.username);
  const setFields = useFields((state) => state.setFields);

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={(text) => {
          startTransition(() => {
            const trimmed = text.trimStart();
            if (
              (trimmed.length === 0 && text.length > 0) ||
              trimmed === username
            )
              return;
            setFields("username", trimmed);
          });
        }}
      />
      <HelperText type="error" visible={isEmpty(username)}>
        Username required!
      </HelperText>
    </View>
  );
}

function EmailField() {
  const [_isPending, startTransition] = useTransition();
  const email = useFields((state) => state.email);
  const setFields = useFields((state) => state.setFields);

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={(text) => {
          startTransition(() => {
            const trimmed = text.trimStart();
            if ((trimmed.length === 0 && text.length > 0) || trimmed === email)
              return;
            setFields("email", trimmed);
          });
        }}
      />
      <HelperText type="error" visible={!isEmail(email)}>
        Email address is invalid!
      </HelperText>
    </View>
  );
}

function PhoneField() {
  const [_isPending, startTransition] = useTransition();
  const country = useFields((state) => state.country);
  const phone = useFields((state) => state.phone);
  const setFields = useFields((state) => state.setFields);

  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          mode="outlined"
          style={{ width: "30%" }}
          label="Country"
          value={country}
          onChangeText={(text) => {
            startTransition(() => {
              const trimmed = text.trimStart();
              if (
                (trimmed.length === 0 && text.length > 0) ||
                trimmed === country
              )
                return;
              setFields("country", trimmed);
            });
          }}
        />
        <TextInput
          mode="outlined"
          style={{ width: "65%" }}
          label="Phone"
          value={phone}
          onChangeText={(text) => {
            startTransition(() => {
              const trimmed = text.trimStart();
              if (
                (trimmed.length === 0 && text.length > 0) ||
                trimmed === phone
              )
                return;
              setFields("phone", trimmed);
            });
          }}
        />
      </View>
      <HelperText type="error" visible={!isMobilePhone(`${country}${phone}`)}>
        Phone number is invalid!
      </HelperText>
    </View>
  );
}

function PasswordField() {
  const [_isPending, startTransition] = useTransition();
  const password = useFields((state) => state.password);
  const setFields = useFields((state) => state.setFields);

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          startTransition(() => {
            const trimmed = text.trimStart();
            if (
              (trimmed.length === 0 && text.length > 0) ||
              trimmed === password
            )
              return;
            setFields("password", trimmed);
          });
        }}
      />
      <HelperText type="error" visible={isStrongPassword(password)}>
        Password required!
      </HelperText>
    </View>
  );
}

function SubmitButton() {
  const [disabled, setDisabled] = useState(false);
  const { signUp } = useAuth()!;
  const image = useImagePicker((state) => state.image);
  const username = useFields((state) => state.username);
  const email = useFields((state) => state.email);
  const country = useFields((state) => state.country);
  const phone = useFields((state) => state.phone);
  const password = useFields((state) => state.password);

  return (
    <Button
      mode="contained"
      style={{ width: "100%", borderRadius: 12 }}
      disabled={disabled}
      onPress={async () => {
        await handleAsync(async () => {
          setDisabled(true);
          if (image === null)
            return Alert.alert("Missing", "Make sure to add image");

          const formData = object2formData({
            username,
            email,
            password,
            phone: country + phone,
          });

          // @ts-ignore
          formData.append("image", {
            uri: image.uri,
            name: "image.png",
            type: image.mimeType,
          });

          await signUp(formData);
        }).finally(() => setDisabled(false));
      }}
    >
      Submit
    </Button>
  );
}

export default function SignUp({ navigation }: Props) {
  const theme = useTheme();
  const imagePickerReset = useImagePicker((state) => state.reset);
  const fieldsReset = useFields((state) => state.reset);

  useEffect(() => {
    return () => {
      imagePickerReset();
      fieldsReset();
    };
  }, [fieldsReset, imagePickerReset]);

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
            <ImagePicker />
          </View>
          <UsernameField />
          <EmailField />
          <PhoneField />
          <PasswordField />
        </Card.Content>
        <Card.Actions style={{ flexDirection: "column", gap: 10 }}>
          <SubmitButton />
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
