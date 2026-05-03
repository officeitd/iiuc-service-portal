import { createFileRoute } from '@tanstack/react-router';
import DashboardPage from '#/views/Dashboard';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});
