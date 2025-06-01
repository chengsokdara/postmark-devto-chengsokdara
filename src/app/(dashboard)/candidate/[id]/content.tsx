import { CandidateDetail } from "@/app/(dashboard)/candidate/[id]/detail";
import { NavBar } from "@/app/(dashboard)/navbar";
import { normalizeData, readDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { CandidateDataType, WithNormalize } from "@/types/firestore.type";
import { redirect } from "next/navigation";

type CandidateByIdContentPropType = {
  id: string;
  next?: string;
};

export async function CandidateByIdContent({
  id,
  next,
}: CandidateByIdContentPropType) {
  const data = await readDocument<CandidateDataType>(
    COLLECTIONS.CANDIDATES,
    id,
  );
  if (!data) redirect("/404");
  const candidate = normalizeData<WithNormalize<CandidateDataType>>(data);

  return (
    <>
      <NavBar
        next={next || "/candidate"}
        title={`${candidate.fullName} | Candidate`}
      />
      <section className="h-full overflow-y-auto">
        <CandidateDetail title="Candidate Details" data={candidate} />
      </section>
    </>
  );
}
