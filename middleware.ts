// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Allow maintenance page and Next.js assets
//   if (
//     pathname.startsWith("/maintenance") ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico")
//   ) {
//     return NextResponse.next();
//   }

//   return NextResponse.redirect(
//     new URL("/maintenance", request.url)
//   );
// }

// export const config = {
//   matcher: "/:path*",
// };