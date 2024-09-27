import Cookies from "js-cookie";

interface AuthTokens {
  token: string;
}

// export const getTokenFromCookie = (): string | null => {
//   const token = Cookies.get("authTokens");
//   console.log("Token from cookie:", token);

//   if (token) {
//     try {
//       const parsedToken = JSON.parse(token);
//       console.log("Parsed token:", token);
//       return parsedToken.token;
//     } catch (e) {
//       console.error("Error parsing token:", e);
//       return null;
//     }
//   }
//   return null;
// };

export const getTokenFromCookie = (): string | null => {
  const token = Cookies.get("authTokens");
  console.log("Token from cookie:", token);
  return token || null;
};
