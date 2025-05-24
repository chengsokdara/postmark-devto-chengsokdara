import { EmailContent } from "@/app/(dashboard)/email/content";

export default async function EmailPage() {
  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <EmailContent />
    </main>
  );
}
