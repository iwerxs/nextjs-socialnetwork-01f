//src/components/TrendsSideBar.tsx

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
// import { userDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { title } from "process";
import { formatNumber } from "@/lib/utils";
import { getUserDataSelect } from "@/lib/types";
import FollowButton from "./FollowButton";
// import { setTimeout } from "timers/promises";

export default function TrendsSideBar() {
  return (
    <>
      <div className="sticky top-[5.25rem] hidden h-fit flex-none space-y-5 md:block lg:w-80">
        {/* TrendsSideBar */}
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <WhoToFollow />
          <TrendingTopics />
        </Suspense>
      </div>
    </>
  );
}

//who to follow, who is the user currently following
async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;
  // await new Promise(r=> setTimeout(r, 10000))

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <>
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Who to follow</div>
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
            {/* <Button>Follow</Button> */}
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
// Data is dynamically fetched
const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<
      { hashtag: string; count: bigint }[]
    >`SELECT LOWER(unnest(regex_matches(content, '[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count FROM posts GROUP BY (hashtag) ORDER BY count DESC, hashtag ASC LIMIT 5`;
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);

//Trending Topics with hashtags
async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <>
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Trending</div>
        {trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
          return (
            <>
              <Link key={title} href={`/hashtag/${title}`} className="block">
                <p
                  className="line-clamp-1 break-all font-semibold hover:underline"
                  title={hashtag}
                >
                  {hashtag}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(count)}
                  {count === 1 ? "post" : "posts"}
                </p>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}

// {trendingTopics.map(({hashtag, count}) => ( const title = hashtag.split("#")[1];))}
