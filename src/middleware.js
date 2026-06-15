import { NextResponse } from "next/server";

// Responde preflight CORS (OPTIONS) para que o app mobile (Expo) consuma a API.
export function middleware(request) {
  if (request.method === "OPTIONS" && request.nextUrl.pathname.startsWith("/api")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
