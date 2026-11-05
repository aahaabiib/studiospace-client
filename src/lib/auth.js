import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is missing from client/.env.local');
}

const client =
  globalThis._studioSpaceMongoClient ??
  new MongoClient(process.env.MONGODB_URI);

if (process.env.NODE_ENV !== 'production') {
  globalThis._studioSpaceMongoClient = client;
}

const db = client.db('studiospace');

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // রেজিস্টারের পর Login পেজে যাওয়ার জন্য
  },
    account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
});