import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";

export type ScreenProps<P extends ParamListBase = ParamListBase> = {
  navigation: NavigationProp<P>;
  route: RouteProp<P>;
};
