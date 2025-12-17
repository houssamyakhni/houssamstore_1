import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    // Manually get token to ensure we can read custom claims like 'role'
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Admin Protection
    if (pathname.startsWith("/admin")) {
        // Not logged in -> Login
        if (!token) {
            const url = new URL("/login", req.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }

        // Logged in but not admin -> Home
        if (token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
}

export const config = {
    matcher: ["/admin/:path*", "/cart/:path*"],
};
