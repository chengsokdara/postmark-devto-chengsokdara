import { Dock } from "@/app/(dashboard)/dock";
import { Menu } from "@/app/(dashboard)/menu";
import { auth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const sessonCookie = cookieStore.get("session")?.value;
  if (!sessonCookie) {
    redirect("/auth");
  }
  try {
    await auth.verifySessionCookie(sessonCookie);
  } catch {
    redirect("/auth");
  }
  
  return (
    <div
      id="wrapper"
      className="flex flex-col h-full xl:flex-row xl:max-w-7xl xl:mx-auto xl:gap-x-1"
    >
      <Menu />
      {children}
      <Dock />
    </div>
  );
}
