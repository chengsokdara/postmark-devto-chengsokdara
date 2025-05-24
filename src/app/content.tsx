import { ROUTES } from "@/types/enum.type";
import Link from "next/link";

export function HomeContent() {
  return (
    <>
      <section className="flex flex-col flex-1 items-center justify-center">
        <Link className="btn btn-primary" href={ROUTES.AUTH}>
          Let's get started!
        </Link>
      </section>
    </>
  );
}
