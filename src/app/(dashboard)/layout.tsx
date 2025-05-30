import { Dock } from "@/app/(dashboard)/dock";
import { Menu } from "@/app/(dashboard)/menu";
import { getSessionCookie } from "@/lib/firebase/auth";
import { Providers } from "@/providers/providers";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSessionCookie();
  if (!session) redirect("/auth");

  return (
    <div
      id="wrapper"
      className="flex flex-col h-full xl:flex-row xl:max-w-7xl xl:mx-auto xl:gap-x-1"
    >
      <Providers>
        <Menu />
        {children}
        <Dock />
      </Providers>
    </div>
  );
}
