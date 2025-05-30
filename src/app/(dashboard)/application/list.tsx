import { ApplicationItem } from "@/app/(dashboard)/application/item";
import {
  normalizeData,
  queryDocuments,
  readDocumentsByIds,
} from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type {
  CandidateDataType,
  JobApplicationDataType,
} from "@/types/firestore.type";

export async function ApplicationList() {
  const { data: jobApplications } =
    await queryDocuments<JobApplicationDataType>(COLLECTIONS.JOB_APPLICATIONS);
  const candidateIds = jobApplications.map(
    (jobApplication) => jobApplication.candidateId,
  );
  const candidates = await readDocumentsByIds<CandidateDataType>(
    COLLECTIONS.CANDIDATES,
    candidateIds,
  );
  const candidateMap = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  );
  let applications = jobApplications.map((app) =>
    normalizeData<
      JobApplicationDataType & {
        candidate: CandidateDataType | null;
      }
    >({
      ...app,
      candidate: candidateMap.get(app.candidateId) ?? null,
    }),
  );
  // const duplicated = Array.from({ length: 20 }, () => enrichedApplications[0]);
  // applications = [...applications, ...duplicated];
  // console.log({ applications });
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Name</td>
            <td>Title</td>
            <td>Company</td>
            <td>Email</td>
            <td>Country</td>
            <td>Applied For</td>
            <td>Submitted</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <ApplicationItem
              key={application.id}
              index={index}
              {...application}
            />
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
}
