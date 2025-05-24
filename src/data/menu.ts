import { MenuItems } from "@/types/index.type";
import {
  BriefcaseIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";

export const menuItems: MenuItems[] = [
  {
    href: "/dashboard",
    icon: Squares2X2Icon,
    name: "Dashboard",
  },
  {
    href: "/email",
    icon: InboxArrowDownIcon,
    name: "Email",
  },
  { href: "/application", icon: BriefcaseIcon, name: "Application" },
  { href: "/candidate", icon: UserGroupIcon, name: "Candidate" },
  { href: "/setting", icon: Cog6ToothIcon, name: "Setting" },
];
