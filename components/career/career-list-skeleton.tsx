import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CareerListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="mt-auto">
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
