import {
  CandidateDataType,
  WithIndex,
  WithNormalize,
} from "@/types/firestore.type";
import { EyeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type CandidateItemPropType = WithIndex<WithNormalize<CandidateDataType>>;

export function CandidateItem({ index, ...candidate }: CandidateItemPropType) {
  return (
    <tr className="hover:bg-base-200">
      <th>{index + 1}</th>
      <td>{candidate.fullName || "-"}</td>
      <td>{candidate.currentJobTitle || "-"}</td>
      <td>{candidate.currentCompany || "-"}</td>
      <td>{candidate.email || "-"}</td>
      <td>{candidate.location?.country || "-"}</td>
      <td className="text-center">
        {candidate?.linkedinUrl ? (
          <Link
            className="link link-primary no-underline"
            href={candidate.linkedinUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            🔗
          </Link>
        ) : (
          "-"
        )}
      </td>
      <td>{candidate.createdAt ? candidate.createdAt : "-"}</td>
      <td>
        <Link
          href={`${process.env.APP_ORIGIN}/candidate/${candidate.id}`}
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
