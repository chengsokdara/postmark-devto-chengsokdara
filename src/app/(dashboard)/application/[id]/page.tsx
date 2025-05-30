import { ApplicationByIdContent } from "@/app/(dashboard)/application/[id]/content";
import { redirect } from "next/navigation";

type ApplicationByIdPagePropType = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationByIdPage({
  params,
}: ApplicationByIdPagePropType) {
  const { id } = await params;
  if (!id) redirect("/404");

  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <ApplicationByIdContent id={id} />
    </main>
  );
}
