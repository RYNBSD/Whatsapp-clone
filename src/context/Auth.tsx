import type { ReactNode } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
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
import setCookieParser from "set-cookie-parser";
import * as SecureStore from "expo-secure-store";
import { object2formData, request } from "../util";
import { Alert } from "react-native";

type User = {
  id: number;
  username: string;
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
  update: () => Promise<void>;
  remove: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

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

  const getJWT = useCallback(
    (headers: Headers) => {
      const cookies = setCookieParser(headers.get("set-cookie") ?? "");
      if (cookies.length === 0) return;

      const token = cookies.find((cookie) => cookie.name === authorization);
      if (typeof token === "undefined" || token.value.length === 0) return;

      SecureStore.setItem(authorization, token.value);
    },
    [authorization],
  );

  useEffect(() => {
    const token = SecureStore.getItem(authorization) ?? "";
    if (token.length === 0) return;

    (async () => {
      const res = await request("/auth/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;

      const json = await res.json();
      setUser(json.data.user);
    })();
  }, [authorization]);

  const signUp = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-up", {
        method: "POST",
        body,
      });
      getJWT(res.headers);
      const json = await res.json();

      if (res.ok) {
        setUser(json.data.user);
        navigation.navigate("Auth", { screen: "SignIn" });
      } else {
        Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
      }
    },
    [getJWT, navigation],
  );

  const signIn = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-in", {
        method: "POST",
        body,
      });
      getJWT(res.headers);
      const json = await res.json();

      if (res.ok) {
        setUser(json.data.user);
        navigation.navigate("App", { screen: "Chats" });
      } else {
        Alert.alert("Error", json?.data?.message ?? "Can't Sign up");
      }
    },
    [getJWT, navigation],
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

  const update = useCallback(async () => {
    const formData = object2formData(user!);
    const res = await request("/user", {
      method: "PUT",
      body: formData,
    });
    const json = await res.json();
    if (res.ok) setUser(json.data.user);
    else Alert.alert("Error", json?.data?.message ?? "Can't update");
  }, [user]);

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
    const delay = 6000; // 1 minute

    const interval = setInterval(async () => {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, delay);

      const res = await request("/auth/status", { signal: controller.signal });
      if (!res.ok) Alert.alert("Offline", "Can't reach the server");

      clearTimeout(timeout);
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [signOut, user]);

  return (
    <AuthContext.Provider
      value={{ user, signUp, signIn, signOut, update, remove, onChangeText }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
