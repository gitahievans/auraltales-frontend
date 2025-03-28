import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const isLoggingOut = request.nextUrl.searchParams.has("logout");
  if (isLoggingOut) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  console.log("Middleware - Path:", request.nextUrl.pathname);
  console.log("Middleware - Token:", token);

  if (!token) {
    console.log("Middleware - No token, redirecting to /?unauthorized=true");
    const url = new URL("/", request.url);
    url.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(url);
  }

  const authorRoutes = ["/author"];
  const adminRoutes = ["/admin"];

  const isAuthorRoute = authorRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthorRoute && !token.is_author) {
    console.log("Middleware - Not an author, redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isAdminRoute && !token.is_staff) {
    console.log("Middleware - Not staff, redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/author/:path*", "/admin/:path*"],
};
