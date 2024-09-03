//src/app/main/SessionProvider.tsx
//protects pages from unauthenticated users
"use client";

import { Session, User } from "lucia";
import React, { useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = React.createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

//create custom hook for context, a defined non-nullable context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
