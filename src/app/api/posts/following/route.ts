//src/app/api/posts/following/route.ts

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// route handler for GET followers, POST followers on the client side
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "UnAthorizeD" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: getPostDataInclude(user.id),
    });

    const nextCursor =
      posts.length > pageSize ? posts[posts.length - 1].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Int Srv Error" }, { status: 500 });
  }
}
