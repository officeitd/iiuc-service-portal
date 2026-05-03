import { createMiddleware } from '@tanstack/react-start';

import { requireSessionUser } from '../services/auth.service';

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const authUser = await requireSessionUser();

    return next({
      context: {
        authUser,
      },
    });
  },
);
