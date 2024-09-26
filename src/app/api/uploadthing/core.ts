//src/app/api/uploadthing/core.ts
// Amazon S3 Upload Thing API
// use unique uploadthing url to protect the backend server
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";

// f=fileRoute
const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("unauthorised");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl: newAvatarUrl },
      });

      return { avatarUrl: newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
