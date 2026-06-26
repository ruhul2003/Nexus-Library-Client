import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'https://nexus-library-client.vercel.app',

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



  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  trustedOrigins: [
    'https://nexus-library-client.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000'
  ].filter(Boolean),
});

export default auth;