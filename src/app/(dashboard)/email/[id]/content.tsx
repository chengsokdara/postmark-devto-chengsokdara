import { EmailDetail } from "@/app/(dashboard)/email/[id]/detail";
import { NavBar } from "@/app/(dashboard)/navbar";
import { normalizeData, readDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { EmailDataType, WithNormalize } from "@/types/firestore.type";
import { redirect } from "next/navigation";

type EmailByIdContentPropType = {
  id: string;
};

export async function EmailByIdContent({ id }: EmailByIdContentPropType) {
  const data = await readDocument<EmailDataType>(
    COLLECTIONS.EMAILS,
    decodeURIComponent(id),
  );
  if (!data) redirect("/404");
  const email = normalizeData<WithNormalize<EmailDataType>>(data);

  return (
    <>
      <NavBar
        next="/email"
        title={`${email.FromName} - ${email.From} | Parsed Email`}
      />
      <section className="h-full overflow-y-auto">
        <EmailDetail title="Email Details" data={email} />
      </section>
    </>
  );
}
