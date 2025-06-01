import { Dock } from "@/app/(dashboard)/dock";
import { LogoutButton } from "@/app/(dashboard)/logout-button";
import { Menu } from "@/app/(dashboard)/menu";
import { getSessionCookie } from "@/lib/firebase/auth";
import { Providers } from "@/providers/providers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSessionCookie();
  if (!session) redirect("/auth");

  return (
    <div
      id="wrapper"
      className="flex flex-col h-full xl:flex-row xl:max-w-7xl xl:mx-auto xl:gap-x-3"
    >
      <Providers>
        <ul className="hidden menu menu-xl bg-base-200 gap-y-3 xl:flex">
          <li key="logo" className="max-w-[4.75rem] mt-3 -mx-2" title="Ra𓂀">
            <Link
              className="relative bg-base-100 px-3 py-2 rounded-tr-4xl rounded-bl-4xl"
              href="/"
            >
              <p className="font-(family-name:--font-playwrite) text-[1rem] mb-1 ms-[0.325rem] z-10">
                Ra𓂀
              </p>
            </Link>
          </li>
          <Menu />
          <div className="mt-auto">
            <li key="logout">
              <LogoutButton />
            </li>
          </div>
        </ul>
        {children}
        <div className="dock xl:hidden">
          <Dock />
        </div>
      </Providers>
    </div>
  );
}
