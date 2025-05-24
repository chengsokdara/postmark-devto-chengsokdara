import { AuditDataType } from "@/types/index.type";

export type CreateProfileDataType = {
  avatar?: string | null;
  email?: string | null;
  name: string | null;
  uid: string | null;
} & AuditDataType