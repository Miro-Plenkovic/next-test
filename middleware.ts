import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
const authMiddleware = NextAuth(authConfig).auth

export default async function middleware(req: any) {
  try {
    return await authMiddleware(req)
  } catch (e) {
    console.error("Middleware error:", e)
    throw e
  }
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};

// export function middleware() {
//   return
// }