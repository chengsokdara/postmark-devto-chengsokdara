import { EmailByIdContent } from "@/app/(dashboard)/email/[id]/content";
import { redirect } from "next/navigation";

type EmailByIdPagePropType = {
  params: Promise<{ id: string }>;
};

export default async function EmailByIdPage({ params }: EmailByIdPagePropType) {
  const { id } = await params;
  if (!id) redirect("/404");

  return (
    <main className="flex flex-col flex-1 bg-base-200">
      <EmailByIdContent id={id} />
    </main>
  );
}
