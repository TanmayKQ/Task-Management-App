import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const isAuthPage =
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/signup";
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

    // If user is logged in and trying to access auth pages, redirect to dashboard
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is not logged in and trying to access dashboard, redirect to login
    if (!user && isDashboard) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
