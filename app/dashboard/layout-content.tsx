"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useHeader } from "@/lib/contexts/header-context";

export default function DashboardLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const { config } = useHeader();

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset>
        <SiteHeader
          title={config.title}
          description={config.description}
          actions={config.actions}
          showSidebarTrigger={config.showSidebarTrigger}
          className={config.className}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
