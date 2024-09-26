//src/app/(main)/users/[username]/actions.ts
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  // valid import values first
  const validatedValues = updateUserProfileSchema.parse(values);

  // fetch Session second, as this requires a db request
  const { user } = await validateRequest();

  if (!user) throw new Error("unauthorised");

  // rtn updated user to the frontend
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });
  return updatedUser;
}
