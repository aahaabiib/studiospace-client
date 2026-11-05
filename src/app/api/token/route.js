import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'studio_token';
const MAX_AGE = 7 * 24 * 60 * 60; // ৭ দিন

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      const response = NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
      response.cookies.set(COOKIE_NAME, '', {
        ...cookieOptions,
        maxAge: 0,
      });
      return response;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing from client/.env.local');
    }

    const token = jwt.sign(
      {
        email: session.user.email,
        name: session.user.name || '',
      },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '7d',
      }
    );

    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Failed to create API token:', error);

    return NextResponse.json(
      { message: 'Failed to create API token' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, '', {
    ...cookieOptions,
    maxAge: 0,
  });

  return response;
}