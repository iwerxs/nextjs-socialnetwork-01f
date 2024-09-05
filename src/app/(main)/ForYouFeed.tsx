//src/app/main/ForYouFeed.tsx
// React Query Function

"use client";

import Post from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import keyInstance from "@/lib/ky";
import { PostData, PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      keyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    //   async () => {
    //   const res = await fetch("/api/posts/for-you");
    //   if (!res.ok) {
    //     throw Error(`Request failed with status code ${res.status}`);
    //   }
    //   return res.json();
    // },
  });
  //get posts from data
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  //query status
  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">An error has occurred</p>
    );
  }
  //return post data from query
  return (
    <>
      <div className="space-y-5">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {/* load next page */}
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Load More
        </Button>
      </div>
    </>
  );
}
