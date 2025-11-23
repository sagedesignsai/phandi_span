import { MarketingHeader } from "@/components/marketing/marketing-header";
import { CTASection } from "@/components/marketing/cta-section";
import { ChatPreview } from "@/components/marketing/chat-preview";
import { EditorPreview } from "@/components/marketing/editor-preview";
import { SparklesIcon, FileTextIcon, PaletteIcon, DownloadIcon, ZapIcon, Wand2Icon, CheckCircleIcon } from "lucide-react";

export default function FeaturesPage() {
  const detailedFeatures = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Resume Creation",
      description: "Our intelligent AI assistant guides you through creating a professional resume step-by-step. Simply chat about your experience, skills, and goals, and watch as your resume comes to life.",
      benefits: [
        "Conversational interface - no forms to fill",
        "Smart suggestions based on your industry",
        "Automatic formatting and structure",
        "Real-time updates as you chat",
      ],
    },
    {
      icon: FileTextIcon,
      title: "WYSIWYG Editor",
      description: "Edit your resume with our intuitive What-You-See-Is-What-You-Get editor. Make changes directly on the PDF preview and see results instantly.",
      benefits: [
        "Real-time PDF preview",
        "Click-to-edit interface",
        "Drag and drop sections",
        "Undo/redo functionality",
      ],
    },
    {
      icon: PaletteIcon,
      title: "Professional Templates",
      description: "Choose from a variety of professionally designed templates. Each template is optimized for different industries and career levels.",
      benefits: [
        "Multiple template options",
        "Industry-specific designs",
        "ATS-friendly formats",
        "Customizable colors and fonts",
      ],
    },
    {
      icon: DownloadIcon,
      title: "Export & Share",
      description: "Export your resume as a high-quality PDF ready for job applications. Share with recruiters or download for offline use.",
      benefits: [
        "High-quality PDF export",
        "Print-ready format",
        "Optimized file size",
        "Maintains formatting",
      ],
    },
    {
      icon: ZapIcon,
      title: "Real-Time Collaboration",
      description: "Watch your resume update in real-time as the AI makes changes. No page refreshes or waiting - see updates instantly.",
      benefits: [
        "Instant visual feedback",
        "Live preview updates",
        "Smooth animations",
        "No data loss",
      ],
    },
    {
      icon: Wand2Icon,
      title: "Smart Suggestions",
      description: "Get AI-powered suggestions to improve your resume content, formatting, and overall presentation. Make your resume stand out.",
      benefits: [
        "Content optimization tips",
        "Formatting suggestions",
        "Keyword recommendations",
        "Industry best practices",
      ],
    },
  ];

  return (
    <>
      <MarketingHeader />
      <main className="w-full">
        {/* Hero Section */}
        <section className="py-24 bg-background w-full">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-muted-foreground">FEATURES</span>
                <div className="h-px w-12 bg-border" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold">Everything You Need</h1>
              <p className="text-xl text-muted-foreground">
                Powerful features designed to help you create a standout resume
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-24 bg-muted/30 w-full">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="space-y-16">
              {detailedFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? "lg:grid-flow-dense" : ""
                    }`}
                  >
                    <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <h2 className="text-3xl font-bold">{feature.title}</h2>
                        </div>
                        <p className="text-lg text-muted-foreground">{feature.description}</p>
                        <ul className="space-y-3">
                          {feature.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                      {index === 0 && (
                        <div className="h-[500px] rounded-lg overflow-hidden border bg-background">
                          <ChatPreview className="h-full" />
                        </div>
                      )}
                      {index === 1 && (
                        <div className="h-[500px] rounded-lg overflow-hidden border bg-background">
                          <EditorPreview className="h-full" />
                        </div>
                      )}
                      {index > 1 && (
                        <div className="h-[500px] rounded-lg bg-muted/50 border flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <Icon className="w-16 h-16 text-muted-foreground mx-auto" />
                            <p className="text-muted-foreground">Feature Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
