import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { HeaderProvider } from '@/lib/contexts/header-context';
import DashboardLayoutContent from './layout-content';

export const metadata: Metadata = {
  title: 'Dashboard | Phandi Span',
  description: 'Your personal dashboard for managing resumes, jobs, and career tools',
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HeaderProvider
      initialConfig={{
        title: "Dashboard",
        description: "Overview of your career management tools",
        showSidebarTrigger: true,
      }}
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </HeaderProvider>
  );
}