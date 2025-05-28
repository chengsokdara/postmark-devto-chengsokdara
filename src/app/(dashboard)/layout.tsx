import { Dock } from "@/app/(dashboard)/dock";
import { Menu } from "@/app/(dashboard)/menu";
import { getAuthUser } from "@/lib/firebase/auth";
import { readDocument } from "@/lib/firestore/admin";
import { Providers } from "@/providers/providers";
import { COLLECTIONS } from "@/types/enum.type";
import { UserDataType } from "@/types/firestore.type";
import { QUERY_KEYS } from "@/types/key.type";
import { normalizeData } from "@/lib/firestore/admin";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) redirect("/auth");

  const authUser = await getAuthUser(sessionCookie);
  if (!authUser) redirect("/auth");

  console.log({ authUser });
  const userProfile = await readDocument(COLLECTIONS.PROFILES, authUser.uid);
  if (!userProfile) redirect("/auth");

  // const user = normalizeData<UserDataType>({ ...authUser });
  const user = normalizeData<UserDataType>({ ...authUser, ...userProfile });
  const queryClient = new QueryClient();
  queryClient.setQueryData([QUERY_KEYS.USER], user ?? null);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div
      id="wrapper"
      className="flex flex-col h-full xl:flex-row xl:max-w-7xl xl:mx-auto xl:gap-x-1"
    >
      <Providers initialUser={user} dehydratedState={dehydratedState}>
        <Menu />
        {children}
        <Dock />
      </Providers>
    </div>
  );
}
