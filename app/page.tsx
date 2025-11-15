import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            Welcome to Phandi'span
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            Create professional resumes and CVs with AI assistance. Build, edit, and export your resume in minutes.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/resumes/new">
              Create Resume
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
