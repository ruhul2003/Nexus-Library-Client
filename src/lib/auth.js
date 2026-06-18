import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  database: mongodbAdapter(db, {
    client
  }),

  // Map additional fields coming from the client into your DB
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "reader", // Set default to 'reader' matching your UX
      },
    },
  },
});