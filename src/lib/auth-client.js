import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, useSession } = createAuthClient()
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL
})