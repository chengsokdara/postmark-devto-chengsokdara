import {
  EmailDataType,
  WithIndex,
  WithNormalize,
} from "@/types/firestore.type";
import { EyeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type EmailItemPropType = WithIndex<WithNormalize<EmailDataType>>;

export function EmailItem({ index, ...email }: EmailItemPropType) {
  return (
    <tr className="hover:bg-base-200">
      <th>{index + 1}</th>
      <td>{email.FromName || "-"}</td>
      <td>{email.From || "-"}</td>
      <td>{email.Subject || "-"}</td>
      <td>{email.Date || "-"}</td>
      <td>{email.To || "-"}</td>
      <td className="text-center">{email.MessageID || "-"}</td>
      <td>{email.Tag || "-"}</td>
      <td>
        <Link
          href={`${process.env.APP_ORIGIN}/email/${email.id}`}
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
