"use client";

import { auth } from "@/lib/firebase/client";
import { readDocument } from "@/lib/firestore/client";
import { COLLECTIONS } from "@/types/enum.type";
import { UserDataType } from "@/types/firestore.type";
import { QUERY_KEYS } from "@/types/key.type";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const user = auth.currentUser;
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    enabled: !!user?.uid,
    queryFn: async () => {
      const profile = await readDocument(COLLECTIONS.PROFILES, user?.uid);
      if (profile) {
        const newUser = { ...user, ...profile } as UserDataType;
        return newUser;
      }
    },
  });
}
