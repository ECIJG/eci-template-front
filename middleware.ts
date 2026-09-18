import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow public and static assets (also handled by matcher)
	if (
		pathname.startsWith("/_next") ||
		pathname.includes("/api/") ||
		pathname.includes("/assistance") ||
		pathname.includes("/images/") ||
		pathname.includes("/api/auth/session") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	// Check session token from NextAuth
	const token = await getToken({
		req: request as any,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// If no token and not already on auth pages, redirect to login
	if (
		!token &&
		!pathname.startsWith("/login") &&
		!pathname.startsWith("/logout")
	) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
