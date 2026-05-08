import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Define protected paths
    const isAdminPath = pathname.startsWith("/admin");
    const isOrderPath = pathname.startsWith("/checkout") || pathname.startsWith("/orders");

    if (isAdminPath || isOrderPath) {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            // Redirect to login if no token found
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Verify the token
            const result = await jwtVerify(token, key);
            const payload = result.payload as any; // Cast payload to any to access custom properties

            // Check for admin role if accessing admin paths
            if (isAdminPath && payload.role !== "admin") {
                // Redirect non-admins to home page
                return NextResponse.redirect(new URL("/", req.url));
            }

            // Allow access if all checks pass
            return NextResponse.next();
        } catch (error) {
            console.error("Token verification failed:", error);
            // Redirect to login if token is invalid or expired
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow access to other paths
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/checkout/:path*",
        "/orders/:path*"
    ],
};
