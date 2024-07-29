import type { ReactNode } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import type { ImagePickerAsset } from "expo-image-picker";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { object2formData, request } from "../util";
import { Alert } from "react-native";

type User = {
  id: number;
  username: string;
  image: string;
  email: string;
  phone: string;
  password: string;
};

type AuthValue = {
  user: User | null;
  onChangeText: (key: keyof User, type: string) => void;
  signUp: (body: FormData) => Promise<void>;
  signIn: (body: FormData) => Promise<void>;
  signOut: () => Promise<void>;
  update: (image: ImagePickerAsset | null) => Promise<void>;
  remove: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

SplashScreen.preventAutoHideAsync();

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [_isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);
  const authorization = useMemo(() => "authorization", []);

  const onChangeText = useCallback((key: keyof User, text: string) => {
    startTransition(() => {
      setUser((prev) => (prev === null ? prev : { ...prev, [key]: text }));
    });
  }, []);

  const me = useCallback(async () => {
    const res = await request("/auth/me", { method: "POST" });
    if (!res.ok) return;

    const json = await res.json();
    setUser(json.data.user);
  }, []);

  useEffect(() => {
    me().finally(() => SplashScreen.hideAsync());
  }, [me]);

  const signUp = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-up", {
        method: "POST",
        body,
      });
      const json = await res.json();

      if (res.ok) {
        navigation.navigate("Auth", { screen: "SignIn" });
      } else {
        Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
      }
    },
    [navigation],
  );

  const signIn = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-in", {
        method: "POST",
        body,
      });
      const json = await res.json();

      if (res.ok) {
        setUser(json.data.user);
        navigation.navigate("App", { screen: "Chats" });
      } else {
        Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
      }
    },
    [navigation],
  );

  const signOut = useCallback(async () => {
    const res = await request("/auth/sign-out", { method: "POST" });
    if (res.ok) {
      await SecureStore.deleteItemAsync(authorization);
      setUser(null);
      navigation.navigate("Auth", { screen: "SignIn" });
    } else {
      const json = await res.json();
      Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
    }
  }, [authorization, navigation]);

  const update = useCallback(
    async (image: ImagePickerAsset | null) => {
      const formData = object2formData(user!);

      if (image !== null) {
        // @ts-ignore
        formData.append("image", {
          uri: image.uri,
          name: "image.png",
          type: image.mimeType,
        });
      }

      const res = await request("/user", {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (res.ok) setUser(json.data.user);
      else Alert.alert("Error", json?.data?.message ?? "Can't update");
    },
    [user],
  );

  const remove = useCallback(async () => {
    const res = await request("/user", { method: "DELETE" });
    if (res.ok) {
      await SecureStore.deleteItemAsync(authorization);
      return setUser(null);
    }

    const json = await res.json();
    Alert.alert("Error", json?.data?.message ?? "Can't delete");
  }, [authorization]);

  useEffect(() => {
    const delay = 6000 * 10; // 10 minute

    const interval = setInterval(async () => {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, delay);

      const res = await request("/auth/status", { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) return;
      await me();
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [me, signOut, user]);

  return (
    <AuthContext.Provider
      value={{ user, signUp, signIn, signOut, update, remove, onChangeText }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
