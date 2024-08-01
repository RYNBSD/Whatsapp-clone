// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import { Image } from "expo-image";
import type { ComponentProps, FC } from "react";
import { memo } from "react";
import { Badge, Card, useTheme } from "react-native-paper";
import { useSocket } from "../context";
import { View } from "react-native";

const UserCard: FC<Props> = ({ id, username, image, ...props }) => {
  const theme = useTheme();
  const { connectedContacts } = useSocket()!;

  return (
    // @ts-ignore
    <Card
      mode="contained"
      style={{ backgroundColor: theme.colors.background }}
      {...props}
    >
      <Card.Title
        left={({ size }) => (
          <View style={{ position: "relative", width: size, height: size }}>
            <Badge
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: connectedContacts.includes(id)
                  ? "green"
                  : "red",
              }}
              size={7.5}
            />
            <Image
              style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
              source={`${BASE_URL}/${image}`}
              contentFit="cover"
            />
          </View>
        )}
        title={username}
        titleVariant="headlineSmall"
      />
    </Card>
  );
};

type Props = {
  id: number;
  username: string;
  image: string;
} & Omit<ComponentProps<typeof Card>, "children" | "ref">;

export default memo(UserCard);
