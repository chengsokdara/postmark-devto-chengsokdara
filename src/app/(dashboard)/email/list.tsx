import { normalizeData, queryDocuments } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { EmailDataType, WithNormalize } from "@/types/firestore.type";
import {
  defaultColumns,
  defineColumn,
  defineColumns,
  RaTable,
} from "@/ui/RaTable";

export async function EmailList() {
  const { data } = await queryDocuments<EmailDataType>(COLLECTIONS.EMAILS);
  const emails = data.map((email) =>
    normalizeData<WithNormalize<EmailDataType>>(email),
  );

  // const duplicated = Array.from({ length: 20 }, (_, idx) => ({
  //   ...emails[0],
  //   id: `${idx}`,
  // }));
  // emails = [...emails, ...duplicated];
  // console.log({ emails });

  const columns = defineColumns([
    defaultColumns.index,
    defineColumn<EmailDataType>("FromName", "From"),
    defineColumn<EmailDataType>("From", "Email"),
    defineColumn<EmailDataType>("Subject", "Subject"),
    defineColumn<EmailDataType>("Date", "Date", (row) => (
      <td key="Date">{new Date(row.Date).toLocaleString()}</td>
    )),
    defineColumn<EmailDataType>("To", "To"),
    defineColumn<EmailDataType>("MessageID", "Message ID"),
    defineColumn<EmailDataType>("Tag", "Tag"),
    defaultColumns.viewButton((id) => `/email/${id}`),
  ]);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <RaTable rows={emails} columns={columns} />
    </div>
  );
}
