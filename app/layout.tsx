import type { Metadata } from "next";
import {
  firaSans,
  firaCode,
  firaMono,
  comodo,
  surgena,
  inter
} from '@/lib/fonts';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ChatProvider } from '@/lib/ai/chat-context';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: "Phandi'span - Resume Management Platform",
  description: "Create and manage your resumes with AI assistance. Build, edit, and export your resume in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaSans.variable} ${firaCode.variable} ${firaMono.variable} ${comodo.variable} ${surgena.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ChatProvider>
              <NextTopLoader />
              {children}
              <Toaster position="bottom-right" richColors />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
