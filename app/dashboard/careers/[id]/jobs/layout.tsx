import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Jobs | Dashboard | Phandi Span',
  description: 'Manage job matches, applications, and preferences for your resume',
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
