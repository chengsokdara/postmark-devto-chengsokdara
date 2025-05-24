import { ROUTES } from "@/types/enum.type";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col h-full bg-base-200 xl:max-w-7xl xl:mx-auto">
      <section className="flex flex-col flex-1 items-center justify-center gap-y-6">
        <h1 className="text-4xl font-bold">404</h1>
        <p>This page could not be found!</p>
        <Link className="btn btn-primary" href={ROUTES.HOME}>
          Back Home
        </Link>
      </section>
    </main>
  );
}
