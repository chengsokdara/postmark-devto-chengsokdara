import { EmailItem } from "@/app/(dashboard)/email/item";
import { normalizeData, queryDocuments } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { EmailDataType, WithNormalize } from "@/types/firestore.type";

export async function EmailList() {
  const { data } = await queryDocuments<EmailDataType>(COLLECTIONS.EMAILS);
  let emails = data.map((email) =>
    normalizeData<WithNormalize<EmailDataType>>(email),
  );

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <th>From</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Date</th>
            <th>To</th>
            <th>Attachments</th>
            <th>Tag</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {emails.map((email, index) => (
            <EmailItem key={email.id} index={index} {...email} />
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
}
