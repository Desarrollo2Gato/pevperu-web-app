// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      type?: string; // Can be string or undefined
      company_id?: string | null; // Can be string or null
      logo?: string | null; // Can be string or null
    };
  }

  interface User {
    accessToken?: string;
    type?: string;
    company_id?: string | null; // Can be string or null
    logo?: string | null; // Can be string or null
  }

  interface JWT {
    accessToken?: string;
    type?: string;
    company_id?: string | null; // Can be string or null
    logo?: string | null; // Can be string or null
    exp?: number; // Expiration
  }
}
