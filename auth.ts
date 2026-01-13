// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import z from "zod"
import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"
import type { User } from "@/app/lib/definitions"

async function getUser(email: string): Promise<User | undefined> {
  const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
  return user.rows[0]
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await getUser(email)
        if (!user) return null

        const ok = await bcrypt.compare(password, user.password)
        return ok ? user : null
      },
    }),
  ],
})
