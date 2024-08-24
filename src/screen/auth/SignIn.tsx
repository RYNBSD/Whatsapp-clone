import { useEffect, useState, useTransition } from "react";
import { View } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Card,
  HelperText,
} from "react-native-paper";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import { create } from "zustand";
import { ScreenProps } from "../../types";
import { useAuth } from "../../context";
import { handleAsync, object2formData } from "../../util";

type Fields = { email: string; password: string };

const useFields = create<
  {
    setFields: (key: keyof Fields, text: string) => void;
    reset: () => void;
  } & Fields
>((set) => ({
  email: "",
  password: "",
  setFields: (key: keyof Fields, text: string) => set({ [key]: text }),
  reset: () => set({ email: "", password: "" }),
}));

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
      <HelperText type="error" visible={isEmpty(password)}>
        Password required!
      </HelperText>
    </View>
  );
}

function SubmitButton() {
  const [disabled, setDisabled] = useState(false);
  const email = useFields((state) => state.email);
  const password = useFields((state) => state.password);
  const { signIn } = useAuth()!;

  return (
    <Button
      mode="contained"
      style={{ width: "100%", borderRadius: 12 }}
      disabled={disabled}
      onPress={() => {
        handleAsync(() => {
          setDisabled(true);
          signIn(object2formData({ email, password }));
        }).finally(() => setDisabled(false));
      }}
    >
      Submit
    </Button>
  );
}

export default function SignUp({ navigation }: Props) {
  const theme = useTheme();
  const reset = useFields((state) => state.reset);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

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
        <Card.Title title="Sign in" titleVariant="headlineLarge" />
        <Card.Content>
          <EmailField />
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
            <Text>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              Sign up
            </Button>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
}

type Props = ScreenProps;
