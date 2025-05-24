import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  console.log(middleware.name, { sessionCookie });
  const isRoot = request.nextUrl.pathname === "/";
  if (isRoot && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (isRoot && !sessionCookie) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|auth).*)"],
};
