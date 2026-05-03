import { createFileRoute } from '@tanstack/react-router';

import IndexPage from '#/views/Index';

export const Route = createFileRoute('/')({
  component: IndexPage,
});
