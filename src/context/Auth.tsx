import type { ReactNode } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { createContext, useCallback, useContext, useState } from "react";
import { request } from "../util/http";
import { useNavigation } from "@react-navigation/native";
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
  signUp: (body: FormData) => Promise<void>;
  signIn: (body: FormData) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [user, setUser] = useState<User | null>(null);

  const signUp = useCallback(
    async (body: FormData) => {
      const res = await request("/auth/sign-up", {
        method: "POST",
        body,
      });
      const json = await res.json();

      if (res.ok) {
        setUser(json.data.user);
        navigation.navigate("Auth", { screen: "SignIn" });
      } else {
        Alert.alert("Error", json.data?.message ?? "Can't Sign up");
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
        Alert.alert("Error", json.data?.message ?? "Can't Sign up");
      }
    },
    [navigation],
  );

  const signOut = useCallback(async () => {
    const res = await request("/auth/sign-out", { method: "POST" });
    if (res.ok) {
      setUser(null);
      navigation.navigate("Auth", { screen: "SignIn" });
    } else {
      const json = await res.json();
      Alert.alert("Error", json.data?.message ?? "Can't Sign up");
    }
  }, [navigation]);

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
