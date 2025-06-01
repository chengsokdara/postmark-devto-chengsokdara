"use client";

import { menuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Dock() {
  const pathname = usePathname();

  return menuItems.map((item) => (
    <Link
      key={item.href}
      className={item.href === pathname ? "dock-active" : ""}
      href={item.href}
    >
      <item.icon className="size-5" />
      <span className="dock-label">{item.name}</span>
    </Link>
  ));
}
