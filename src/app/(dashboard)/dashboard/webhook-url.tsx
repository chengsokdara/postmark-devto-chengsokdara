import { CopyButton } from "@/app/(dashboard)/dashboard/copy-button";

type WebhookUrlPropType = {
  slug?: string | null;
};

export function WebhookUrl({ slug }: WebhookUrlPropType) {
  return (
    <div className="flex flex-col gap-y-6">
      <p className="text-primary">{`${process.env.APP_ORIGIN}/webhook/${slug}`}</p>
      <CopyButton slug={slug} />
    </div>
  );
}
