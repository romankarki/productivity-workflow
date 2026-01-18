import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function DayLoading() {
  return (
    <MainLayout>
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-7 w-56" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Task List Skeleton */}
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
