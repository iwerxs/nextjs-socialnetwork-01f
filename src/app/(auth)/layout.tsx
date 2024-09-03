//src/app/auth/layout.tsx

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //check for current user session and fetch once
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
}
