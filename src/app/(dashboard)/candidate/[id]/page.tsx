import { CandidateByIdContent } from "@/app/(dashboard)/candidate/[id]/content";
import { redirect } from "next/navigation";

type CandidateByIdPagePropType = {
  params: Promise<{ id: string }>;
};

export default async function CandidateByIdPage({
  params,
}: CandidateByIdPagePropType) {
  const { id } = await params;
  if (!id) redirect("/404");

  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <CandidateByIdContent id={id} />
    </main>
  );
}
