import { useCallback, useState, useTransition } from "react";
import { Alert, View } from "react-native";
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
import { ScreenProps } from "../../types";
import { request } from "../../util/http";

export default function SignUp({ navigation }: Props) {
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

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
        <Card.Title title="Sign in" titleVariant="headlineLarge" />
        <Card.Content>
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
            <TextInput
              mode="outlined"
              label="Password"
              value={fields.password}
              secureTextEntry
              onChangeText={(text) => onChangeText("password", text)}
            />
            <HelperText type="error" visible={isEmpty(fields.password)}>
              Password required!
            </HelperText>
          </View>
        </Card.Content>
        <Card.Actions style={{ flexDirection: "column", gap: 10 }}>
          <Button
            mode="contained"
            style={{ width: "100%", borderRadius: 12 }}
            onPress={async () => {
              const res = await request(`/auth/sign-in`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(fields),
              });

              if (res.ok) return navigation.navigate("App", { screen: "Chat" });

              const json = await res.json();
              Alert.alert("Error", json.data?.message ?? "Can't Sign up");
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
