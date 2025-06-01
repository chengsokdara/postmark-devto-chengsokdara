import { ApplicationDetail } from "@/app/(dashboard)/application/[id]/detail";
import { NavBar } from "@/app/(dashboard)/navbar";
import { normalizeData, readDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type {
  CandidateDataType,
  JobApplicationDataType,
  WithNormalize,
} from "@/types/firestore.type";
import { redirect } from "next/navigation";

type ApplicationByIdContentPropType = {
  id: string;
};

export async function ApplicationByIdContent({
  id,
}: ApplicationByIdContentPropType) {
  const jobApplication = await readDocument<JobApplicationDataType>(
    COLLECTIONS.JOB_APPLICATIONS,
    id,
  );
  if (!jobApplication) redirect("/404");
  const data = await readDocument<CandidateDataType>(
    COLLECTIONS.CANDIDATES,
    jobApplication.candidateId,
  );
  const application =
    normalizeData<WithNormalize<JobApplicationDataType>>(jobApplication);
  const candidate = normalizeData<WithNormalize<CandidateDataType>>(data);

  return (
    <>
      <NavBar
        next="/application"
        title={`${candidate.fullName} - ${application.position.title} | Job Application`}
      />
      <section className="h-full overflow-y-auto">
        <ApplicationDetail title="Candidate Information" data={candidate} />
        <ApplicationDetail title="Job Application Details" data={application} />
      </section>
    </>
  );
}
