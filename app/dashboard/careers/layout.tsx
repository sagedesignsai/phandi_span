import { ChatPanelProvider } from '@/lib/contexts/chat-panel-context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Dashboard | Phandi Span',
  description: 'Create, edit, and manage your professional career profiles',
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  <ChatPanelProvider>
    {children}
  </ChatPanelProvider>
</>;
}