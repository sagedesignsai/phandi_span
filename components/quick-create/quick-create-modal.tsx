import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuickAction } from "./quick-action";
import { IconFilePlus, IconBriefcase, IconMail, IconSparkles, IconCode, IconPalette } from "@tabler/icons-react";
import { useState } from "react";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionClick?: (action: string) => void;
}

export function QuickCreateModal({ 
  open, 
  onOpenChange, 
  onActionClick 
}: QuickCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = async (action: string) => {
    setIsLoading(true);
    try {
      // Simulate API call or navigation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (onActionClick) {
        onActionClick(action);
      }
      
      // Close modal after action
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      id: "new-resume",
      icon: <IconFilePlus className="size-5" />,
      title: "New Resume",
      description: "Create a new resume from scratch"
    },
    {
      id: "new-career-profile",
      icon: <IconBriefcase className="size-5" />,
      title: "New Career Profile",
      description: "Set up a new career profile"
    },
    {
      id: "new-cover-letter",
      icon: <IconMail className="size-5" />,
      title: "New Cover Letter",
      description: "Generate a custom cover letter"
    },
    {
      id: "ai-assistant",
      icon: <IconSparkles className="size-5" />,
      title: "AI Assistant",
      description: "Chat with AI for instant help"
    },
    {
      id: "new-project",
      icon: <IconCode className="size-5" />,
      title: "New Project",
      description: "Add a project to your portfolio"
    },
    {
      id: "new-skill",
      icon: <IconPalette className="size-5" />,
      title: "New Skill",
      description: "Add a new skill to your profile"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Actions</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <QuickAction
              key={action.id}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={() => handleActionClick(action.id)}
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}