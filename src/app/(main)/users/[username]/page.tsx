//src/app/(main)/users/[username]/page.tsx

import { validateRequest } from "@/auth";
import TrendsSideBar from "@/components/TrendsSideBar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PageProps {
  params: { username: string };
}

//fetch user from DB, to display user name
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });
  // chk user exists
  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  //fetch current logged in user
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <>
        <p className="text-destructive">
          You Are Not Authorised to View this Page
        </p>
      </>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <>
      <main className="flex w-full min-w-0 gap-3">
        <div className="w-full min-w-0 space-y-5">
          <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        </div>
        <TrendsSideBar />
      </main>
    </>
  );
}

//show User Profile
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  // follower and following info
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };
  return (
    <>
      <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={250}
          className="mx-auto size-full max-h-60 max-w-60 rounded-full"
        />
        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="me-auto space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <div className="text-muted-foreground">@{user.username}</div>
            </div>
            <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
            <div className="flex items-center gap-3">
              <span>
                Posts:{" "}
                <span className="font-semibold">
                  {formatNumber(user._count.posts)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
