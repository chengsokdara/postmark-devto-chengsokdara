import type {
  CandidateDataType,
  JobApplicationDataType,
  WithIndex,
} from "@/types/firestore.type";
import { EyeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type ApplicationItemPropType = WithIndex<
  JobApplicationDataType & {
    candidate: CandidateDataType | null;
  }
>;

export function ApplicationItem({
  candidate,
  index,
  ...application
}: ApplicationItemPropType) {
  return (
    <tr className="hover:bg-base-200">
      <th>{index + 1}</th>
      <th className="px-0">
        <Link
          href={`/application/${application.id}`}
          className="btn btn-circle btn-ghost"
        >
          <EyeIcon className="size-5" />
        </Link>
      </th>
      <td>{candidate?.fullName || "-"}</td>
      <td>{candidate?.currentJobTitle || "-"}</td>
      <td>{candidate?.currentCompany || "-"}</td>
      <td>{candidate?.email || "-"}</td>
      <td>{candidate?.location?.country || "-"}</td>
      <td>{application.position?.title || "-"}</td>
      <td>
        {application.application?.submittedAt
          ? new Date(application.application.submittedAt).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  );
}
