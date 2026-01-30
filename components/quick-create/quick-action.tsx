import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export function QuickAction({ 
  icon, 
  title, 
  description, 
  onClick, 
  className 
}: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex h-auto w-full flex-col items-center justify-center gap-2 p-4 text-left transition-all duration-200 hover:border-primary hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Button>
  );
}