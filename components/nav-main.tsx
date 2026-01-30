"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { useQuickCreate } from "@/lib/contexts/quick-create-context"
import { QuickCreateModal } from "@/components/quick-create/quick-create-modal"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const { isOpen, openModal, closeModal, onActionClick, setOnActionClick } = useQuickCreate()

  const handleAction = (action: string) => {
    // Handle the quick action based on the action type
    switch (action) {
      case 'new-resume':
        window.location.href = '/dashboard/careers/new'
        break
      case 'new-career-profile':
        window.location.href = '/dashboard/careers/new'
        break
      case 'new-cover-letter':
        // Find the first career profile and navigate to cover letter creation
        const careersLink = items.find(item => item.url.includes('/careers'))
        if (careersLink) {
          window.location.href = `${careersLink.url}/cover-letters/new`
        }
        break
      case 'ai-assistant':
        // Navigate to AI assistant page
        window.location.href = '/dashboard/ai-assistant'
        break
      case 'new-project':
      case 'new-skill':
        // For now, just show a toast or alert
        alert(`Creating new ${action.replace('new-', '')}`)
        break
      default:
        console.log('Unknown action:', action)
    }

    // Call the custom action handler if provided
    if (onActionClick) {
      onActionClick(action)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={openModal}
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      <QuickCreateModal 
        open={isOpen} 
        onOpenChange={closeModal}
        onActionClick={handleAction}
      />
    </SidebarGroup>
  )
}
