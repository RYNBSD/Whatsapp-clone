import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useReducer } from "react";

type AuthState = {
  isLoading: boolean;
  userToken: string;
  isSignIn: boolean;
};

enum TypeAction {
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

type AuthAction = {
  type: TypeAction;
};

type AuthValue = {} & AuthState;

const AuthContext = createContext<AuthValue | null>(null);

function reducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case TypeAction.SIGN_IN:
    case TypeAction.SIGN_OUT:
    default:
      return state;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, dispatch] = useReducer((state, action) => {}, {
    isLoading: true,
    userToken: "",
    isSignIn: false,
  });

  useEffect(() => {
    (async () => {})();
  }, []);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
