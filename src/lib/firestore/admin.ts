import { db } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { WithId, WithNormalize } from "@/types/firestore.type";
import {
  CollectionReference,
  Timestamp,
  type DocumentData,
  type DocumentReference,
} from "firebase-admin/firestore";

export const addDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  data: T,
): Promise<string> => {
  const ref = await db.collection(collectionName).add(data);
  return ref.id;
};

export const createDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  idOrRef: string | DocumentReference<T>,
  data: T,
): Promise<void> => {
  const ref = getDocumentRef(collectionName, idOrRef);
  await ref.set(data);
};

export const deleteDocument = async (
  collectionName: COLLECTIONS,
  id: string,
): Promise<void> => {
  const ref = db.collection(collectionName).doc(id);
  await ref.delete();
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  idOrRef: string | DocumentReference<T>,
  data: Partial<T>,
): Promise<void> => {
  const ref = getDocumentRef(collectionName, idOrRef);
  await ref.update(data);
};

export const upsertDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  idOrRef: string | DocumentReference<T>,
  data: T,
): Promise<void> => {
  const ref = getDocumentRef(collectionName, idOrRef);
  await ref.set(data, { merge: true });
};

export const readDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  id?: string | null,
): Promise<WithId<T> | null> => {
  if (!id) return null;
  const docSnap = await db.collection(collectionName).doc(id).get();
  if (!docSnap.exists) return null;
  return mapDoc<T>(docSnap);
};

export async function readDocumentsByIds<T>(
  collectionName: COLLECTIONS,
  ids: string[],
): Promise<WithId<T>[]> {
  const promises = ids.map(async (id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as WithId<T>) : null;
  });
  const results = await Promise.all(promises);
  return results.filter(Boolean) as WithId<T>[];
}

export type WhereClause<T = DocumentData> = [
  field: keyof T & string,
  op:
    | FirebaseFirestore.WhereFilterOp
    | import("firebase/firestore").WhereFilterOp,
  value: any,
];

export type OrderByClause = [field: string, order: "asc" | "desc"];

export interface QueryOptions<T = DocumentData> {
  where?: WhereClause<T> | WhereClause<T>[];
  orderBy?: OrderByClause[];
  limit?: number;
  offset?: number;
  select?: string[];
  startAt?: any;
  startAfter?: any;
  endAt?: any;
  endBefore?: any;
}

export const queryDocuments = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  options: QueryOptions<T> = {},
): Promise<{ data: WithId<T>[]; lastDoc: any }> => {
  const db = (await import("@/lib/firebase/admin")).db;
  let query: FirebaseFirestore.Query = db.collection(collectionName);

  if (options.select?.length) query = query.select(...options.select);

  for (const [field, op, value] of normalizeWhere(options.where)) {
    query = query.where(
      field as string,
      op as FirebaseFirestore.WhereFilterOp,
      value,
    );
  }

  for (const [field, dir] of options.orderBy || []) {
    query = query.orderBy(field, dir);
  }

  if (options.startAt) query = query.startAt(options.startAt);
  if (options.startAfter) query = query.startAfter(options.startAfter);
  if (options.endAt) query = query.endAt(options.endAt);
  if (options.endBefore) query = query.endBefore(options.endBefore);
  if (options.offset) query = query.offset(options.offset);
  if (options.limit) query = query.limit(options.limit);

  const snap = await query.get();
  const docs = snap.docs.map((doc) => mapDoc<T>(doc));
  return { data: docs, lastDoc: snap.docs[snap.docs.length - 1] ?? null };
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const getCollectionRef = <T extends DocumentData>(
  collectionName: COLLECTIONS,
): CollectionReference<T> => {
  return db.collection(collectionName) as CollectionReference<T>;
};

export const getDocumentRef = <T extends DocumentData>(
  collectionName: COLLECTIONS,
  idOrRef: string | DocumentReference<T>,
): DocumentReference<T> => {
  return typeof idOrRef === "string"
    ? (db.collection(collectionName).doc(idOrRef) as DocumentReference<T>)
    : idOrRef;
};

export function mapDoc<T>(doc: DocumentData): WithId<T> {
  return { id: doc.id, ...doc.data() };
}

export function normalizeData<T extends Record<string, any>>(data: any): T {
  const result: Record<string, any> = {};
  for (const key in data) {
    const value: any = data[key];
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toLocaleString();
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

export function normalizeWhere<T>(
  where?: WhereClause<T> | WhereClause<T>[],
): WhereClause<T>[] {
  if (!where) return [];
  return Array.isArray(where[0])
    ? (where as WhereClause<T>[])
    : [where as WhereClause<T>];
}
