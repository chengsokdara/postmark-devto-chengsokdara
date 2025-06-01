import { normalizeData, queryDocuments } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { CandidateDataType, WithNormalize } from "@/types/firestore.type";
import {
  defaultColumns,
  defineColumn,
  defineColumns,
  RaTable,
} from "@/ui/RaTable";

export async function CandidateList() {
  const { data } = await queryDocuments<CandidateDataType>(
    COLLECTIONS.CANDIDATES,
  );
  let candidates = data.map((candidate) =>
    normalizeData<WithNormalize<CandidateDataType>>(candidate),
  );

  const duplicated = Array.from({ length: 20 }, (_, idx) => ({
    ...candidates[0],
    id: `${idx}`,
  }));
  candidates = [...candidates, ...duplicated];
  // console.log({ candidates });

  const columns = defineColumns([
    defaultColumns.index,
    defineColumn<CandidateDataType>("fullName", "Name"),
    defineColumn<CandidateDataType>("currentJobTitle", "Title"),
    defineColumn<CandidateDataType>("currentCompany", "Company"),
    defineColumn<CandidateDataType>("email", "Email"),
    defineColumn<CandidateDataType>("location", "Country", (row) => (
      <td key="location">{row.location?.country || "-"}</td>
    )),
    defineColumn<CandidateDataType>("linkedinUrl", "LinkedIn"),
    defineColumn<CandidateDataType>("createdAt", "Submitted"),
    defaultColumns.viewButton((id) => `/candidate/${id}`),
  ]);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <RaTable rows={candidates} columns={columns} />
    </div>
  );
}
