//src/app/(main)/users/[username]/UserPostsFeed.tsx
// React Query Fn: same code as ForYouFeed
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

interface UserPostFeedProps {
  userId: string;
}

export default function UserPostsFeed({ userId }: UserPostFeedProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      keyInstance
        .get(
          `/api/users/${userId}/posts`,
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
        <p className="text-center text-muted-foreground">
          No posts by this User
        </p>
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
        {/* loading state */}
        {isFetchingNextPage && (
          <Loader2 className="mx-auto my-3 animate-spin" />
        )}
      </InfiniteScrollContainer>
    </>
  );
}
