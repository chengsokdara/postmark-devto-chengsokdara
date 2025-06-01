import {
  normalizeData,
  queryDocuments,
  readDocumentsByIds,
} from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type {
  CandidateDataType,
  JobApplicationDataType,
  WithNormalize,
} from "@/types/firestore.type";
import {
  defaultColumns,
  defineColumn,
  defineColumns,
  RaTable,
} from "@/ui/RaTable";
import Link from "next/link";

type ApplicationDataType = WithNormalize<JobApplicationDataType> & {
  candidate: WithNormalize<CandidateDataType> | null;
};

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
    candidates.map((candidate) => [candidate.id, normalizeData(candidate)]),
  );
  let applications = jobApplications.map((app) =>
    normalizeData<ApplicationDataType>({
      ...app,
      candidate: candidateMap.get(app.candidateId) ?? null,
    }),
  );
  const duplicated = Array.from({ length: 20 }, (_, idx) => ({
    ...applications[0],
    id: `${idx}`,
  }));
  applications = [...applications, ...duplicated];
  // console.log({ applications });

  const columns = defineColumns([
    defaultColumns.index,
    defineColumn<ApplicationDataType>("fullName", "Name", (row) => (
      <td key="fullName" className="p-0">
        {row.candidate?.fullName ? (
          <Link
            className="block w-full h-full px-4 py-3"
            href={`/candidate/${row.candidate.id}?next=${encodeURIComponent("/application")}`}
          >
            {row.candidate.fullName}
          </Link>
        ) : (
          "-"
        )}
      </td>
    )),
    defineColumn<ApplicationDataType>("currentJobTitle", "Title", (row) => (
      <td key="currentJobTitle">{row.candidate?.currentJobTitle || "-"}</td>
    )),
    defineColumn<ApplicationDataType>("currentCompany", "Company", (row) => (
      <td key="currentCompany">{row.candidate?.currentCompany || "-"}</td>
    )),
    defineColumn<ApplicationDataType>("candidate", "Email", (row) => (
      <td key="email" className="p-0">
        {row.candidate?.email ? (
          <Link
            className="block w-full h-full px-4 py-3"
            href={`/candidate/${row.candidate.id}?next=${encodeURIComponent("/application")}`}
          >
            {row.candidate.email}
          </Link>
        ) : (
          "-"
        )}
      </td>
    )),
    defineColumn<ApplicationDataType>("country", "Country", (row) => (
      <td key="country">{row.candidate?.location?.country || "-"}</td>
    )),
    defineColumn<ApplicationDataType>("position", "Applied For", (row) => (
      <td key="position">{row.position?.title || "-"}</td>
    )),
    defineColumn<ApplicationDataType>("submittedAt", "Submitted", (row) => (
      <td key="submittedAt">{row.application?.submittedAt || "-"}</td>
    )),
    defaultColumns.viewButton((id) => `/application/${id}`),
  ]);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <RaTable rows={applications} columns={columns} />
      {/* <table className="table table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th>#</th>
            <th className="p-0 text-center">✨</th>
            <td>Name</td>
            <td>Title</td>
            <td>Company</td>
            <td>Email</td>
            <td>Country</td>
            <td>Applied For</td>
            <td>Submitted</td>
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
      </table> */}
    </div>
  );
}
