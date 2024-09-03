//src/components/SearchField.tsx
"use client";

import { useRouter } from "next/navigation";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {}

  return <form onSubmit={handleSubmit}></form>;
}
