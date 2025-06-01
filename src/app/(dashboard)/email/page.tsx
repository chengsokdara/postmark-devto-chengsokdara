import { EmailContent } from "@/app/(dashboard)/email/content";

export default async function EmailPage() {
  return (
    <main className="flex flex-col flex-1 bg-base-200 pb-dock-height overflow-hidden xl:pb-0">
      <EmailContent />
    </main>
  );
}
