import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resumes | Dashboard | Phandi Span',
  description: 'Create, edit, and manage your professional resumes',
};

export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
