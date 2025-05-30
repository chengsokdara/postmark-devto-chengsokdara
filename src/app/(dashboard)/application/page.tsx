import { ApplicationContent } from "@/app/(dashboard)/application/content";

export default async function ApplicationPage() {
  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <ApplicationContent />
    </main>
  );
}
