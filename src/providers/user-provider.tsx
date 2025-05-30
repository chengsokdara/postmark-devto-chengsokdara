"use client";

import { auth } from "@/lib/firebase/client";
import { readDocument } from "@/lib/firestore/client";
import { getQueryClient } from "@/lib/react-query/query-client";
import { COLLECTIONS } from "@/types/enum.type";
import type { UserDataType } from "@/types/firestore.type";
import { QUERY_KEYS } from "@/types/key.type";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef } from "react";

type UserProviderPropType = {
  dehydratedState: unknown;
  initialUser: UserDataType | null;
};

export function UserProvider({
  dehydratedState,
  initialUser,
}: UserProviderPropType) {
  const queryClient = getQueryClient();

  const prevUserIdRef = useRef<string | null>(initialUser?.uid ?? null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const newUserId = user?.uid ?? null;
      if (newUserId !== prevUserIdRef.current) {
        const updateUser = async () => {
          if (newUserId) {
            const profile = await readDocument(COLLECTIONS.PROFILES, newUserId);
            const newUser = { ...user, ...profile } as UserDataType;
            queryClient.setQueryData([QUERY_KEYS.USER], newUser ?? null);
          } else {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER] });
          }
          prevUserIdRef.current = newUserId;
        };
        updateUser();
      }
    });

    return () => unsub?.();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}></HydrationBoundary>
    </QueryClientProvider>
  );
}
