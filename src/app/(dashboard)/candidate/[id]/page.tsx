import { CandidateByIdContent } from "@/app/(dashboard)/candidate/[id]/content";
import { redirect } from "next/navigation";

type CandidateByIdPagePropType = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CandidateByIdPage({
  params,
  searchParams,
}: CandidateByIdPagePropType) {
  const { id } = await params;
  const queryParams = await searchParams;
  const next =
    typeof queryParams.next === "string"
      ? decodeURIComponent(queryParams.next)
      : undefined;
  if (!id) redirect("/404");

  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <CandidateByIdContent id={id} next={next} />
    </main>
  );
}
