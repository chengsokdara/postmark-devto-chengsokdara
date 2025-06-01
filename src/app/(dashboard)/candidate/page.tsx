import { CandidateContent } from "@/app/(dashboard)/candidate/content";

export default async function EmailPage() {
  return (
    <main className="flex flex-col flex-1 bg-base-200 pb-dock-height overflow-hidden xl:pb-0">
      <CandidateContent />
    </main>
  );
}
