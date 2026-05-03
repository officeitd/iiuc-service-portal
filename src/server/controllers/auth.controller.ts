import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getSessionUser,
  login,
  logout,
  requireSessionUser,
  signup,
} from '../services/auth.service';

const roleSchema = z.enum(['student', 'teacher', 'admin']);

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema,
});

export const signupFn = createServerFn({ method: 'POST' })
  .inputValidator(signupSchema)
  .handler(({ data }) => signup(data));

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(({ data }) => login(data));

export const logoutFn = createServerFn({ method: 'POST' }).handler(() =>
  logout(),
);

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => ({ user: await getSessionUser() }),
);

export const requireAuthFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(({ context }) => context.authUser);

export const meFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(() => requireSessionUser());
