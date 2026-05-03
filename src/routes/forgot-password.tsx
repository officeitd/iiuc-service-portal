import { createFileRoute } from '@tanstack/react-router';
import ForgotPasswordPage from '#/views/ForgotPassword';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});
