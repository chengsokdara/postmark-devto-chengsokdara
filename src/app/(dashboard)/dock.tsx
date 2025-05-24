import { menuItems } from "@/data/menu";
import Link from "next/link";

export function Dock() {
  return (
    <div className="dock xl:hidden">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {/* <button className="flex flex-col items-center"> */}
          <item.icon className="size-5" />
          <span className="dock-label">{item.name}</span>
          {/* </button> */}
        </Link>
      ))}
    </div>
  );
}
