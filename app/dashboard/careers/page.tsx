"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, MoreVerticalIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useHeaderContext } from "@/lib/contexts/header-context";
import { Empty } from "@/components/ui/empty";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCareerProfiles } from "@/lib/hooks/use-career-profiles";

export default function CareersPage() {
  const { profiles, isLoading, createProfile, refetch } = useCareerProfiles();
  const { updateConfig } = useHeaderContext();

  useEffect(() => {
    updateConfig({
      title: 'Career Profiles',
      description: 'Manage your career profiles and professional journeys',
      actions: (
        <Button asChild>
          <Link href="/dashboard/careers/create">
            <PlusIcon className="size-4 mr-2" />
            Create Career Profile
          </Link>
        </Button>
      ),
    });
  }, [updateConfig]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this career profile? This will also delete all associated resumes and data.')) {
      try {
        await fetch(`/api/career-profiles/${id}`, { method: 'DELETE' });
        toast.success('Career profile deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete career profile');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">Loading career profiles...</div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Empty
                title="No career profiles yet"
                description="Create your first career profile to start managing your professional journey"
                action={
                  <Button asChild>
                    <Link href="/dashboard/careers/create">
                      <PlusIcon className="size-4 mr-2" />
                      Create Career Profile
                    </Link>
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {profile.description || 'No description'}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {new Date(profile.created_at!).toLocaleDateString()}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete(profile.id!)} className="text-destructive">
                            Delete Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full gap-2">
                      <Link href={`/dashboard/careers/${profile.id}`}>
                        Open Profile
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
