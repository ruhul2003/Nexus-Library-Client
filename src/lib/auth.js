import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_APP_URL || 
           'https://nexus-library-client.vercel.app',

  emailAndPassword: { enabled: true },

  database: mongodbAdapter(db, { client }),

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "reader" },
    },
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },

  // Critical fixes for Vercel + Stripe cross-domain redirect
  cookieOptions: {
    secure: true,                    // Always true for HTTPS
    sameSite: isProduction ? 'none' : 'lax',
    httpOnly: true,
    path: '/',
    domain: isProduction ? undefined : undefined, // Let browser handle domain
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  // Important: Trust forwarded headers (Vercel)
  trustedOrigins: [
    'https://nexus-library-client.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000'
  ].filter(Boolean),
});

export default auth;