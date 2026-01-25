import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function CareerProfileSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-6 space-y-6">
      <div className="w-full">
        {/* Tabs List Skeleton */}
        <div className="grid w-full grid-cols-2 mb-6 h-10 bg-muted rounded-lg p-1">
          <Skeleton className="h-full w-full rounded-md" />
          <div className="h-full w-full" />
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Resume Preview Section Skeleton */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                  <Skeleton className="w-full sm:w-[150px] aspect-[1/1.4] rounded-lg" />
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats / Quick Actions Sidebar Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-8 rounded-lg" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-8 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
