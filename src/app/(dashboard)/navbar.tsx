import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type NavBarPropType = {
  next?: string;
};

export function NavBar({ next }: NavBarPropType) {
  return (
    <div className="navbar bg-base-200 border-b-3 border-b-base-100">
      <div className="flex-1">
        {next && (
          <Link className="btn btn-circle btn-soft" href={next}>
            <ChevronLeftIcon className="size-5" />
          </Link>
        )}
        <a className="btn btn-ghost text-xl">Ra𓂀</a>
      </div>
    </div>
  );
}
