"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Cookies from "js-cookie";
import axios from "axios";
import { apiUrls } from "../utils/api/apiUrls";

type User = {
  email: string;
  type: string;
  name: string;
  logo: string | null;
  company_id: number;
};
type AuthContextType = {
  user: User | null;
  login: (authTokens: string, userInfo: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  refreshToken?: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: () => false,
  refreshToken: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState<string | null>(null);

  const login = useCallback(function (authTokens: string, userInfo: User) {
    Cookies.set("authTokens", authTokens);
    Cookies.set("user", JSON.stringify(userInfo));
    setAuthTokens(authTokens);
    setUser(userInfo);
  }, []);

  const logout = useCallback(function () {
    Cookies.remove("authTokens");
    Cookies.remove("user");
    setAuthTokens(null);
    setUser(null);
  }, []);

  const isAdmin = useCallback(
    function () {
      return user?.type === "admin" || user?.type === "company_owner";
    },
    [user]
  );

  const refreshToken = useCallback(async () => {
    const currentToken = Cookies.get("authTokens");

    try {
      if (currentToken) {
        const res = await axios.post(
          apiUrls.auth.refresh,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );
        const user = res.data.user;
        const userInfo = {
          name: user.full_name,
          email: user.email,
          type: user.type,
          logo: user.company?.logo || null,
          company_id: user.company?.id,
        };
        const newAuthTokens: string = res.data.access_token;
        setAuthTokens(newAuthTokens);
        Cookies.set("authTokens", newAuthTokens);
        Cookies.set("user", JSON.stringify(userInfo));
        console.log("Token refreshed");
      } else {
        logout();
      }
    } catch (error) {
      console.log("Error refreshing token", error);
      logout();
    }
  }, [logout]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    const currentToken = Cookies.get("authTokens");

    if (currentToken) {
      try {
        await refreshToken();
        return true;
      } catch (error) {
        console.log("Token is invalid, logging out", error);
        logout();
        return false;
      }
    }
    logout();
    return false;
  }, [logout, refreshToken]);
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        logout();
      }
    };
    checkToken();
  }, [validateToken]);

  useEffect(() => {
    const savedAuthTokens = Cookies.get("authTokens");
    const savedUser = Cookies.get("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedAuthTokens) {
      setAuthTokens(savedAuthTokens);
      refreshToken();
    } else {
      logout();
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    if (authTokens) {
      const refreshInterval = setInterval(() => {
        refreshToken();
        console.log("Refreshing token interval");
      }, 55 * 60 * 1000); // 1 minute
      return () => clearInterval(refreshInterval);
    }
  }, [authTokens, refreshToken]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAdmin,
      refreshToken,
    }),
    [user, login, logout, user, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
