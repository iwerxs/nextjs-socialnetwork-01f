//src/app/main/ForYouFeed.tsx
// React Query Function

"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import DeletePostDialog from "@/components/posts/DeletePostDialog";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
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
    return <PostsLoadingSkeleton />;
    // <Loader2 className="mx-auto animate-spin" />;
  }

  // check for 'empty' posts on page
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <>
        <p className="text-center text-muted-foreground">No posts yet</p>
      </>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">An error has occurred</p>
    );
  }
  //return post data from query
  return (
    <>
      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {isFetchingNextPage && (
          <Loader2 className="mx-auto my-3 animate-spin" />
        )}
        {/* <DeletePostDialog open onClose={() => {}} post={posts[0]} /> */}
        {/* load next page manually */}
        {/* <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Load More
        </Button> */}
      </InfiniteScrollContainer>
    </>
  );
}
