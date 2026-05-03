import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '#/views/Login';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

///
