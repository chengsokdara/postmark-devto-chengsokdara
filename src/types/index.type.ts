import { FieldValue } from "firebase/firestore";
import type { ElementType } from "react";

export type AuditDataType = {
  createdAt?: FieldValue | null;
  createdBy?: FieldValue | null;
  updatedAt: FieldValue | null;
  updatedBy?: FieldValue | null;
};

export type MenuItems = {
  href: string;
  icon: ElementType;
  name: string;
};
