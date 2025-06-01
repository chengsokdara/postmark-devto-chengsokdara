import { ROUTES } from "@/types/enum.type";
import Link from "next/link";

export function HomeContent() {
  return (
    <>
      <section className="flex flex-col flex-1 items-center justify-center gap-y-6">
        <h1 className="font-(family-name:--font-playwrite) text-[4rem] ms-[0.325rem] z-10">
          Ra𓂀
        </h1>
        <p className="text-base-content/60 text-lg">
          Postmark x Dev.to Challenge by Cheng Sokdara
        </p>
        <Link className="btn btn-primary" href={ROUTES.AUTH}>
          Let&apos;s get started!
        </Link>
      </section>
    </>
  );
}
