import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  // Production + Local both handle করার জন্য
  baseURL: process.env.BETTER_AUTH_URL 
           || process.env.NEXT_PUBLIC_APP_URL 
           || 'http://localhost:3000',

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

  // Vercel-এর জন্য গুরুত্বপূর্ণ
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
});