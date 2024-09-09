//src/app/api/users/[userId]/followers/route.ts
// api route to retrieve the current follower information of a user

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "unathorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "user not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Int Srv Err" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "unathorized" }, { status: 401 });
    }
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: params.userId,
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: params.userId,
      },
      update: {},
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Int Srv Err" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "unathorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Int Srv Err" }, { status: 500 });
  }
}
