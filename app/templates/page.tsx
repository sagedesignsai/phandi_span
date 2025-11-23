"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resumeTemplates } from "@/lib/resume-templates";
import { createResume } from "@/lib/storage/resume-store";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Create a new resume with the selected template
    const newResume = createResume({
      title: "New Resume",
      personalInfo: {
        name: "",
      },
      sections: [],
      template: templateId,
    });
    router.push(`/resumes/${newResume.id}/edit`);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          title="Choose a Template"
          description="Select a template to start building your resume"
          actions={
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeftIcon className="size-4" />
                </Link>
              </Button>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  {/* Template Preview */}
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className="relative z-10 text-center p-4">
                      <div className="text-2xl font-bold text-foreground mb-2">
                        {template.name}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {template.category}
                      </div>
                    </div>
                    {/* Template-specific preview elements */}
                    {template.id === 'modern' && (
                      <div className="absolute left-4 top-4 w-1 h-12 bg-primary rounded-full" />
                    )}
                    {template.id === 'classic' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
                    )}
                    {template.id === 'minimalist' && (
                      <div className="absolute top-8 left-8 right-8 h-px bg-border" />
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {template.name}
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                      {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleUseTemplate(template.id)}
                      disabled={selectedTemplate === template.id}
                    >
                      {selectedTemplate === template.id ? (
                        <>
                          <CheckIcon className="size-4 mr-2" />
                          Creating...
                        </>
                      ) : (
                        "Use Template"
                      )}
                      </Button>
                  </CardContent>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Card>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2">About Templates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a template that matches your style and industry. You can change templates at any time while editing your resume.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Professional</div>
                  <div className="text-muted-foreground">Best for corporate and traditional industries</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Modern</div>
                  <div className="text-muted-foreground">Great for tech, design, and creative fields</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Minimalist</div>
                  <div className="text-muted-foreground">Perfect for ATS systems and clean aesthetics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
