import { CandidateItem } from "@/app/(dashboard)/candidate/item";
import { normalizeData, queryDocuments } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { CandidateDataType, WithNormalize } from "@/types/firestore.type";

export async function CandidateList() {
  const { data } = await queryDocuments<CandidateDataType>(
    COLLECTIONS.CANDIDATES,
  );
  let candidates = data.map((candidate) =>
    normalizeData<WithNormalize<CandidateDataType>>(candidate),
  );

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
            <td>LinkedIn</td>
            <td>Submitted</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <CandidateItem key={candidate.id} index={index} {...candidate} />
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
}
