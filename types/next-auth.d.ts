// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      type?: string;
      company_id?: string | null;
      logo?: string | null;
    };
  }

  interface User {
    accessToken?: string;
    type?: string;
    company_id?: string | null;
    logo?: string | null;
  }

  interface JWT {
    accessToken?: string;
    type?: string;
    company_id?: string | null;
    logo?: string | null;
    exp?: number;
  }
}
