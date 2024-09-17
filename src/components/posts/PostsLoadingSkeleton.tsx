//src/components/posts/PostsLoadingSkeleton.tsx
// a custom loading spinner for displaying posts

import { Skeleton } from "../ui/skeleton";

export default function PostsLoadingSkeleton() {
  return (
    <>
      <div className="space-y-5">
        <PostLoadingSkeleton />
        <PostLoadingSkeleton />
        <PostLoadingSkeleton />
      </div>
    </>
  );
}

function PostLoadingSkeleton() {
  return (
    <>
      <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-16 rounded" />
      </div>
    </>
  );
}
