'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();

export async function logout() {
  try {
    const { error } = await authClient.signOut();

    if (error) {
      throw new Error(error.message || 'Logout failed');
    }
  } finally {
    // BetterAuth session-এর পাশাপাশি Express-এর জন্য তৈরি JWT cookie-ও সরাবে
    await fetch('/api/token', { method: 'DELETE' });
  }
}