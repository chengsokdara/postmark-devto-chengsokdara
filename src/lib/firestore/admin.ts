import { COLLECTIONS } from "@/types/enum.type";
import type { WithId } from "@/types/firestore.type";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";

export const readDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  id?: string | null,
): Promise<WithId<T> | null> => {
  if (!id) return null;
  const db = (await import("@/lib/firebase/admin")).db;
  const docSnap = await db.collection(collectionName).doc(id).get();
  if (!docSnap.exists) return null;
  return mapDoc<T>(docSnap);
};

export function mapDoc<T>(doc: DocumentData): WithId<T> {
  return { id: doc.id, ...doc.data() };
}

export function normalizeData<T extends Record<string, any>>(data: any): T {
  const result: Record<string, any> = {};
  for (const key in data) {
    const value: any = data[key];
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      result[key] = normalizeData(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
