//src/components/posts/actions.ts
// delete posts
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
// import { postDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  //auth user
  const { user } = await validateRequest();

  if (!user) throw new Error("uNathorized");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("post Not found");
  // chk if post is from actual auth user with userId
  if (post.userId !== user.id) throw new Error("unAuthorzied");

  const deletePost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });
  return deletePost;
}
