import type { ComponentProps, FC } from "react";
import { memo } from "react";
import { Card, useTheme } from "react-native-paper";

const UserCard: FC<Props> = ({ username, ...props }) => {
  const theme = useTheme();
  return (
    // @ts-ignore
    <Card
      mode="contained"
      style={{ backgroundColor: theme.colors.background }}
      {...props}
    >
      <Card.Title title={username} />
    </Card>
  );
};

type Props = {
  username: string;
} & Omit<ComponentProps<typeof Card>, "children" | "ref">;

export default memo(UserCard);
