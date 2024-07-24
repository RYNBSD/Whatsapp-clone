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
import isMobilePhone from "validator/lib/isMobilePhone";
import isEmpty from "validator/lib/isEmpty";
import isStrongPassword from "validator/lib/isStrongPassword";
import { ScreenProps } from "../../types";
import { useAuth } from "../../context";

export default function SignUp({ navigation }: Props) {
  const theme = useTheme();
  const [_isPending, startTransition] = useTransition();
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
              const formData = new FormData();
              const body = { ...fields, phone: fields.country + fields.phone };
              Object.entries(body).forEach(([key, value]) => {
                formData.append(key, value);
              });
              await signUp(formData);
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
