import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const authTokens = req.cookies.get("authTokens")?.value;
  const userCookie = req.cookies.get("user")?.value;

  // Redirect to login if not authenticated
  if (!authTokens) {
    // Redirect to login if not authenticated
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
  // Redirect to home if authenticated
  if (authTokens && userCookie) {
    const user = JSON.parse(userCookie);

    // Redirect to home if not admin and trying to access admin
    if (req.nextUrl.pathname.startsWith("/admin") && user.type !== "admin") {
      const url = new URL("/", req.url);
      url.searchParams.set("notAdmin", "true");
      return NextResponse.redirect(url);
    }

    // Redirect to admin if admin and trying to access home
    if (user.type === "admin" && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin(.*)", "/"],
};
