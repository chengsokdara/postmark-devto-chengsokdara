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
      <td>
        <Link
          href={`${process.env.APP_ORIGIN}/application/${application.id}`}
          className="content"
        >
          <button className="btn btn-circle">
            <EyeIcon className="size-5" />
          </button>
        </Link>
      </td>
    </tr>
  );
}
