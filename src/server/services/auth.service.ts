import { createHash, randomUUID } from 'node:crypto';

import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server';
import bcrypt from 'bcryptjs';
import { and, eq, gt } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';

import type { UserRole } from '@/lib/types';

import { db } from '../models';
import { refreshTokens, users } from '../models/schema';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

const jwtSecret = process.env.JWT_SECRET ?? 'change-this-in-production';
const jwtSecretKey = new TextEncoder().encode(jwtSecret);

type JwtClaims = {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
  sid: string;
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
  role: UserRole;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function sanitizeUser(user: SessionUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function cookieBaseOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

function clearAuthCookies() {
  deleteCookie(ACCESS_COOKIE, { httpOnly: true, sameSite: 'lax', path: '/' });
  deleteCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: 'lax', path: '/' });
}

async function signToken(claims: JwtClaims, expiresInSeconds: number) {
  return new SignJWT({
    email: claims.email,
    role: claims.role,
    type: claims.type,
    sid: claims.sid,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(jwtSecretKey);
}

async function issueTokens(user: SessionUser) {
  const sid = randomUUID();

  const accessToken = await signToken(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      type: 'access',
      sid,
    },
    ACCESS_TTL_SECONDS,
  );

  const refreshToken = await signToken(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      type: 'refresh',
      sid,
    },
    REFRESH_TTL_SECONDS,
  );

  return {
    accessToken,
    refreshToken,
    refreshExpiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
  };
}

function setAuthCookies(accessToken: string, refreshToken: string) {
  setCookie(ACCESS_COOKIE, accessToken, cookieBaseOptions(ACCESS_TTL_SECONDS));
  setCookie(
    REFRESH_COOKIE,
    refreshToken,
    cookieBaseOptions(REFRESH_TTL_SECONDS),
  );
}

async function persistRefreshToken(
  userId: number,
  refreshToken: string,
  refreshExpiresAt: Date,
) {
  await db()
    .insert(refreshTokens)
    .values({
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiresAt,
    });
}

async function findUserById(id: number) {
  const rows = await db().select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

async function rotateFromRefreshToken(rawRefreshToken: string) {
  try {
    const { payload } = await jwtVerify(rawRefreshToken, jwtSecretKey);

    if (payload.type !== 'refresh' || !payload.sub) {
      clearAuthCookies();
      return null;
    }

    const userId = Number(payload.sub);
    if (Number.isNaN(userId)) {
      clearAuthCookies();
      return null;
    }

    const tokenHash = hashToken(rawRefreshToken);

    const tokenRows = await db()
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, userId),
          eq(refreshTokens.tokenHash, tokenHash),
          gt(refreshTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!tokenRows[0]) {
      clearAuthCookies();
      return null;
    }

    const user = await findUserById(userId);
    if (!user) {
      clearAuthCookies();
      return null;
    }

    const safeUser = sanitizeUser(user);
    const tokens = await issueTokens(safeUser);

    await db()
      .delete(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));

    await persistRefreshToken(
      userId,
      tokens.refreshToken,
      tokens.refreshExpiresAt,
    );
    setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return safeUser;
  } catch {
    clearAuthCookies();
    return null;
  }
}

async function getUserFromAccessToken(rawAccessToken: string) {
  try {
    const { payload } = await jwtVerify(rawAccessToken, jwtSecretKey);

    if (payload.type !== 'access' || !payload.sub) {
      return null;
    }

    const userId = Number(payload.sub);
    if (Number.isNaN(userId)) {
      return null;
    }

    const user = await findUserById(userId);
    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export async function signup(input: SignupInput) {
  const existing = await db()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing[0]) {
    throw new Error('Email already in use.');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const created = await db()
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  const user = created[0];
  if (!user) {
    throw new Error('Failed to create account.');
  }

  const safeUser = sanitizeUser(user);
  const tokens = await issueTokens(safeUser);
  await persistRefreshToken(
    safeUser.id,
    tokens.refreshToken,
    tokens.refreshExpiresAt,
  );
  setAuthCookies(tokens.accessToken, tokens.refreshToken);

  return safeUser;
}

export async function login(input: LoginInput) {
  const rows = await db()
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  const user = rows[0];
  if (!user?.passwordHash) {
    throw new Error('Invalid email or password.');
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid || user.role !== input.role) {
    throw new Error('Invalid email, password, or role.');
  }

  const safeUser = sanitizeUser(user);
  const tokens = await issueTokens(safeUser);
  await persistRefreshToken(
    safeUser.id,
    tokens.refreshToken,
    tokens.refreshExpiresAt,
  );
  setAuthCookies(tokens.accessToken, tokens.refreshToken);

  return safeUser;
}

export async function logout() {
  const refreshToken = getCookie(REFRESH_COOKIE);

  if (refreshToken) {
    await db()
      .delete(refreshTokens)
      .where(eq(refreshTokens.tokenHash, hashToken(refreshToken)));
  }

  clearAuthCookies();
}

export async function getSessionUser() {
  const accessToken = getCookie(ACCESS_COOKIE);
  if (accessToken) {
    const userFromAccess = await getUserFromAccessToken(accessToken);
    if (userFromAccess) {
      return userFromAccess;
    }
  }

  const refreshToken = getCookie(REFRESH_COOKIE);
  if (!refreshToken) {
    return null;
  }

  return rotateFromRefreshToken(refreshToken);
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
