"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFileDescription,
  IconFilePlus,
  IconTemplate,
  IconSettings,
  IconHelp,
  IconLogin,
  IconBriefcase,
  IconFileCheck,
  IconArrowLeft,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoIcon } from "@/components/logo"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const dashboardItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "My Resumes",
    url: "/dashboard/resumes",
    icon: IconFileDescription,
  },
  {
    title: "New Resume",
    url: "/dashboard/resumes/new",
    icon: IconFilePlus,
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: IconTemplate,
  },
]

const navSecondaryItems = [
  {
    title: "Account Settings",
    url: "#",
    icon: IconSettings,
  },
  {
    title: "Help & Support",
    url: "#",
    icon: IconHelp,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  resumeId?: string;
}

export function AppSidebar({ resumeId, ...props }: AppSidebarProps) {
  const { user, isLoading } = useAuth()
  const isAuthenticated = !!user

  const resumeItems = resumeId ? [
    {
      title: "Back to Dashboard",
      url: "/dashboard",
      icon: IconArrowLeft,
    },
    {
      title: "Resume Editor",
      url: `/dashboard/resumes/${resumeId}/edit`,
      icon: IconFileDescription,
    },
    {
      title: "Job Matches",
      url: `/dashboard/resumes/${resumeId}/jobs/matches`,
      icon: IconBriefcase,
    },
    {
      title: "My Applications",
      url: `/dashboard/resumes/${resumeId}/jobs/applications`,
      icon: IconFileCheck,
    },
    {
      title: "Job Preferences",
      url: `/dashboard/resumes/${resumeId}/jobs/preferences`,
      icon: IconSettings,
    },
  ] : []

  const navItems = resumeId ? resumeItems : dashboardItems

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={isAuthenticated ? "/dashboard" : "/authenticated"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LogoIcon size="sm" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Phandi'span</span>
                  <span className="truncate text-xs text-muted-foreground">Resume Builder</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : isAuthenticated ? (
          <NavMain items={navItems} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/auth/login">
                  <IconLogin />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticated && !isLoading && user && (
          <>
            <NavSecondary items={navSecondaryItems} />
            <NavUser user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar || "/avatars/shadcn.jpg",
            }} />
          </>
        )}
        <ThemeToggle variant="sidebar" />
      </SidebarFooter>
    </Sidebar>
  )
}
