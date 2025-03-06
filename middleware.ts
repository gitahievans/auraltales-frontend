import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { notifications } from "@mantine/notifications";

export async function middleware(request: NextRequest) {
  // Check if this is a logout request/redirect
  const isLoggingOut = request.nextUrl.searchParams.has("logout");

  // If user is in the process of logging out, allow the request to proceed
  if (isLoggingOut) {
    return NextResponse.next();
  }

  // Get the token using next-auth's getToken helper
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If not logged in, redirect to home page
  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(url);
  }

  // Define protected routes
  const authorRoutes = ["/author"];
  const adminRoutes = ["/admin"];

  // Check if the current path is a protected route
  const isAuthorRoute = authorRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // For logged-in users without proper permissions, redirect to unauthorized
  if (isAuthorRoute && !token.is_author) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isAdminRoute && !token.is_staff) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/author/:path*", "/admin/:path*"],
};
