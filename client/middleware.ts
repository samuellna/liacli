import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/amostras",
  "/resultados",
  "/exames",
  "/solicitacoes",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isLoginRoute = pathname.startsWith("/login");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/amostras/:path*",
    "/resultados/:path*",
    "/exames/:path*",
    "/solicitacoes/:path*",
    "/login",
  ],
};
