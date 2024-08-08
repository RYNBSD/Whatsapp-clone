import type { ReactNode } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import type { ImagePickerAsset } from "expo-image-picker";
import type { User } from "../types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { Alert } from "react-native";
import { handleAsync, object2formData, request } from "../util";
import { AUTHORIZATION } from "../constant";

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

  const onChangeText = useCallback((key: keyof User, text: string) => {
    startTransition(() => {
      const trimmed = text.trimStart();
      if (trimmed.length === 0 && text.length > 0) return;
      setUser((prev) => (prev === null ? prev : { ...prev, [key]: text }));
    });
  }, []);

  const me = useCallback(async (init?: RequestInit) => {
    const res = await request("/auth/me", { ...init, method: "POST" });
    if (!res.ok) return;

    const json = await res.json();
    setUser(json.data.user);
  }, []);

  useEffectOnce(() => {
    const controller = new AbortController();
    handleAsync(() => me({ signal: controller.signal })).finally(() =>
      SplashScreen.hideAsync(),
    );
    return () => {
      controller.abort();
    };
  });

  const signUp = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-up", {
        method: "POST",
        body,
      });

      if (res.ok) navigation.navigate("Auth", { screen: "SignIn" });
      else {
        const json = await res.json();
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
      await SecureStore.deleteItemAsync(AUTHORIZATION);
      setUser(null);
      navigation.navigate("Auth", { screen: "SignIn" });
    } else {
      const json = await res.json();
      Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
    }
  }, [navigation]);

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
      await SecureStore.deleteItemAsync(AUTHORIZATION);
      setUser(null);
      navigation.navigate("Auth", { screen: "SignUp" });
    } else {
      const json = await res.json();
      Alert.alert("Error", json?.data?.message ?? "Can't delete");
    }
  }, [navigation]);

  useEffect(() => {
    const delay = 6000 * 10; // 10 minute

    const interval = setInterval(async () => {
      await handleAsync(async () => {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, delay);

        const res = await request("/auth/status", {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) return;
        await me();
      });
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
