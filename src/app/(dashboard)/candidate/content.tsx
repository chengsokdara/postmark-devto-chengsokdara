import { CandidateList } from "@/app/(dashboard)/candidate/list";

export function CandidateContent() {
  return (
    <>
      <section className="flex flex-col flex-1 p-3 overflow-hidden xl:p-6">
        <h2 className="text-2xl px-3 mb-3 xl:px-0 xl:mb-6">Candidates</h2>
        <CandidateList />
      </section>
    </>
  );
}
