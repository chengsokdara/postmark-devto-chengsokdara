import { LogoutButton } from "@/app/(dashboard)/logout-button";
import { menuItems } from "@/data/menu";
import Link from "next/link";

export function Menu() {
  return (
    <ul className="hidden menu menu-xl bg-base-200 gap-y-3 xl:flex">
      {menuItems.map((item) => (
        <li key={item.href}>
          <Link
            className="tooltip tooltip-right text-xl py-6"
            data-tip={item.name}
            href={item.href}
          >
            <item.icon className="size-5" />
          </Link>
        </li>
      ))}
      <div className="mt-auto">
        <li key="logout">
          <LogoutButton />
        </li>
      </div>
    </ul>
  );
}
