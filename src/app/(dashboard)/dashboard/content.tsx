import { WebhookUrl } from "@/app/(dashboard)/dashboard/webhook-url";

export function DashboardContent() {
  return (
    <>
      <WebhookUrl />
      <section className="flex flex-col flex-1 items-center justify-center">
        Dashboard Page
      </section>
    </>
  );
}
