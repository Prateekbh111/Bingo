import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const url = request.nextUrl;
	if (token) {
		if (url.pathname.startsWith("/login") || url.pathname === "/") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}
	if (
		!token &&
		(url.pathname.startsWith("/dashboard") || url.pathname === "/profile")
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/", "/dashboard/:path*", "/profile"],
};
