import Cookies from "js-cookie";

export const getTokenFromCookie = (): string | null => {
  const token = Cookies.get("authTokens");
  return token || null;
};
