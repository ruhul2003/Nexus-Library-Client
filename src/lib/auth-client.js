import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, useSession } = createAuthClient()
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL
})