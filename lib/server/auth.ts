import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { isProduction, serverEnv } from "./env"

export const AUTH_COOKIE = "ge_token"

export type AuthPayload = {
  userId: number
  email: string
  role: "creator" | "merchant" | "admin"
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, serverEnv.jwtSecret, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, serverEnv.jwtSecret) as AuthPayload
  } catch {
    return null
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
