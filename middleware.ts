import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const authTokens = req.cookies.get("authTokens")?.value;
  const userCookie = req.cookies.get("user")?.value;

  // Redirect to login if not authenticated
  if (!authTokens) {
    // Redirect to login if not authenticated
    if (
      req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/empresa")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
  // Redirect to home if authenticated
  if (authTokens && userCookie) {
    const user = JSON.parse(userCookie);

    // Redirect to home if not admin and trying to access admin

    if (user.type === "admin" && req.nextUrl.pathname.startsWith("/empresa")) {
      const url = new URL("/", req.url);
      url.searchParams.set("noAuthorized", "true");
      return NextResponse.redirect(url);
    }

    if (
      user.type === "company_owner" &&
      req.nextUrl.pathname.startsWith("/admin")
    ) {
      const url = new URL("/", req.url);
      url.searchParams.set("noAuthorized", "true");
      return NextResponse.redirect(url);
    }

    // if (
    //   req.nextUrl.pathname.startsWith("/admin") &&
    //   (user.type !== "admin" || user.type !== "company_owner")
    // ) {
    //   const url = new URL("/", req.url);
    //   url.searchParams.set("notautyhorized", "true");
    //   return NextResponse.redirect(url);
    // }

    // Redirect to admin if admin and trying to access home
    if (user.type === "admin" && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.type === "company_owner" && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/empresa", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin(.*)", "/empresa(.*)", "/"],
};
