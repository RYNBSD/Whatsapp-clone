// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import { Image } from "expo-image";
import type { ComponentProps, FC } from "react";
import { memo } from "react";
import { Card, useTheme } from "react-native-paper";

const UserCard: FC<Props> = ({ id, username, image, ...props }) => {
  const theme = useTheme();
  return (
    // @ts-ignore
    <Card
      mode="contained"
      style={{ backgroundColor: theme.colors.background }}
      {...props}
    >
      <Card.Title
        left={({ size }) => (
          <Image
            style={{ width: size, height: size, borderRadius: size / 2 }}
            source={`${BASE_URL}/${image}`}
            contentFit="cover"
          />
        )}
        title={username}
        titleVariant="headlineSmall"
      />
    </Card>
  );
};

type Props = {
  username: string;
  image: string;
} & Omit<ComponentProps<typeof Card>, "children" | "ref">;

export default memo(UserCard);
