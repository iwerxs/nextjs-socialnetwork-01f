//src/lib/types.ts

import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    displayName: true,
    username: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

//User Data Type
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  };
}

// export const userDataSelect = {
//   id: true,
//   username: true,
//   displayName: true,
//   avatarUrl: true,
// } satisfies Prisma.UserSelect;

// export const postDataInclude = {
//   user: {
//     select: userDataSelect,
//   },
// } satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

// Post Page Type, auto complete
export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

//Follower Info Type
export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
