import { View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  TextInput,
  useTheme,
} from "react-native-paper";
import isEmpty from "validator/lib/isEmpty";
import { useAuth } from "../../context";

export default function Portfolio() {
  const theme = useTheme();
  const { user, onChangeText, update, remove } = useAuth()!;

  return (
    <View style={{ flex: 1 }}>
      <Card
        mode="contained"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Card.Content>
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
          <Button onPress={update}>Update</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
