import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth"; // Adjust the path to match your auth.ts location

export async function middleware(request: NextRequest) {
  // Check if this is a logout request/redirect
  const isLoggingOut = request.nextUrl.searchParams.has("logout");
  if (isLoggingOut) {
    console.log("Middleware - Logging out, proceeding to next");
    return NextResponse.next();
  }

  // Get the session using auth
  const session = await auth();

  console.log("Middleware - Path:", request.nextUrl.pathname);
  console.log("Middleware - Session:", JSON.stringify(session, null, 2));

  // If no session or no user, redirect to home with unauthorized=true
  if (!session?.user) {
    console.log("Middleware - No session/user, redirecting to /?unauthorized=true");
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

  // Check permissions for author routes
  if (isAuthorRoute && !session.user.is_author) {
    console.log("Middleware - Not an author, redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Check permissions for admin routes
  if (isAdminRoute && !session.user.is_staff) {
    console.log("Middleware - Not staff, redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  console.log("Middleware - Access granted, proceeding to next");
  return NextResponse.next();
}

export const config = {
  matcher: ["/author/:path*", "/admin/:path*"],
};

