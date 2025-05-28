import { COLLECTIONS } from "@/types/enum.type";
import type { WithId } from "@/types/firestore.type";
import { doc, getDoc, Timestamp, type DocumentData } from "firebase/firestore";

export const readDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  id?: string | null,
): Promise<WithId<T> | null> => {
  if (!id) return null;
  const db = (await import("@/lib/firebase/client")).db;
  const docSnapshot = await getDoc(doc(db, collectionName, id));
  if (!docSnapshot.exists()) return null;
  return mapDoc<T>(docSnapshot);
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
