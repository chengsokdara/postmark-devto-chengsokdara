"use client";

import { menuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const pathname = usePathname();

  return menuItems.map((item) => (
    <li className="list-a" key={item.href}>
      <Link
        className={`${item.href === pathname ? "menu-active " : ""}tooltip tooltip-right text-xl py-6`}
        data-tip={item.name}
        href={item.href}
      >
        <item.icon className="size-5" />
      </Link>
    </li>
  ));
}
