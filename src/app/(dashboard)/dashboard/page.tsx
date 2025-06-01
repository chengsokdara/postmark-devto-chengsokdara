import { DashboardContent } from "@/app/(dashboard)/dashboard/content";

export default async function DashboardPage() {
  return (
    <main className="flex flex-col flex-1 bg-base-200 pb-dock-height overflow-hidden xl:pb-0">
      <DashboardContent />
    </main>
  );
}
