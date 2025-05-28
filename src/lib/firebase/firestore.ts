import { COLLECTIONS } from "@/types/enum.type";
import { type DocumentData as AdminDocumentData } from "firebase-admin/firestore";
import {
  doc,
  getDoc,
  type DocumentData as ClientDocumentData,
} from "firebase/firestore";

type DocumentData = AdminDocumentData | ClientDocumentData;

export type WithId<T> = T & { id: string };

export type WhereClause<T = DocumentData> = [
  field: keyof T & string,
  op:
    | FirebaseFirestore.WhereFilterOp
    | import("firebase/firestore").WhereFilterOp,
  value: any,
];

export type OrderByClause = [string, "asc" | "desc"];

export interface FirestoreQueryOptions<T = DocumentData> {
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

// Utility: assertion for invariants
function invariant(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// Utility: map Firestore doc to plain object with id
function mapDoc<T = DocumentData>(doc: any): WithId<T> {
  return { id: doc.id, ...doc.data() };
}

// In getServerData and getClientData, normalize to array:
function normalizeWhere<T>(
  where?: WhereClause<T> | WhereClause<T>[],
): WhereClause<T>[] {
  if (!where) return [];
  return Array.isArray(where[0])
    ? (where as WhereClause<T>[])
    : [where as WhereClause<T>];
}

// Utility: apply select fields (supports dot-notation for nested fields)
function applySelect(docData: any, select?: string[]) {
  if (!select?.length) return docData;
  const filtered: Record<string, any> = { id: docData.id };
  for (const path of select) {
    const parts = path.split(".");
    let source = docData;
    let target = filtered;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!(part in source)) break;
      if (i === parts.length - 1) {
        target[part] = source[part];
      } else {
        target[part] = target[part] || {};
        source = source[part];
        target = target[part];
      }
    }
  }
  return filtered;
}

// Server-side Firestore query
async function getServerData<T>(
  collectionName: string,
  options: FirestoreQueryOptions<T>,
): Promise<{ data: WithId<T>[]; lastDoc: any }> {
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
}

// Client-side Firestore query
async function getClientData<T>(
  collectionName: string,
  options: FirestoreQueryOptions<T>,
): Promise<{ data: WithId<T>[]; lastDoc: any }> {
  const {
    getDocs,
    collection,
    query: queryFn,
    where: whereFn,
    orderBy: orderByFn,
    limit: limitFn,
    startAt: startAtFn,
    startAfter: startAfterFn,
    endAt: endAtFn,
    endBefore: endBeforeFn,
  } = await import("firebase/firestore");

  const db = (await import("@/lib/firebase/client")).db;
  const ref = collection(db, collectionName);

  let query = queryFn(ref);

  for (const [field, op, value] of normalizeWhere(options.where)) {
    query = queryFn(query, whereFn(field as string, op as any, value));
  }

  for (const [field, dir] of options.orderBy || []) {
    query = queryFn(query, orderByFn(field, dir));
  }

  if (options.startAt) query = queryFn(query, startAtFn(options.startAt));
  if (options.startAfter)
    query = queryFn(query, startAfterFn(options.startAfter));
  if (options.endAt) query = queryFn(query, endAtFn(options.endAt));
  if (options.endBefore) query = queryFn(query, endBeforeFn(options.endBefore));

  if (options.offset && options.offset > 0) {
    invariant(
      options.orderBy?.length,
      "[getCollectionData] Client offset requires orderBy",
    );
    const offsetQuery = queryFn(query, limitFn(options.offset));
    const offsetSnap = await getDocs(offsetQuery);
    const lastDoc = offsetSnap.docs[offsetSnap.docs.length - 1];
    if (!lastDoc) return { data: [], lastDoc: null };
    query = queryFn(query, startAfterFn(lastDoc));
  }

  if (options.limit) query = queryFn(query, limitFn(options.limit));

  const snap = await getDocs(query);
  const docs = snap.docs.map((doc) => applySelect(mapDoc(doc), options.select));
  return { data: docs, lastDoc: snap.docs[snap.docs.length - 1] ?? null };
}

/**
 * Fetches documents from a Firestore collection using flexible query options,
 * designed for both server and client environments. Supports filtering, sorting,
 * pagination, field selection, and dot-notation field projection.
 *
 * @template T - The expected shape of the returned documents.
 * @param collectionName - The Firestore collection name to query.
 * @param options - Optional parameters to shape the query.
 * @param options.where - Filter conditions. Format: [field, operator, value][].
 * @param options.orderBy - Sort order. Format: [field, "asc" | "desc"][].
 * @param options.select - Project specific fields (server-only; simulated on client).
 * @param options.limit - Maximum number of documents to return.
 * @param options.offset - Skips the first N documents (client fallback only).
 * @param options.startAt - Start reading at this cursor.
 * @param options.startAfter - Start reading after this cursor.
 * @param options.endAt - End reading at this cursor.
 * @param options.endBefore - End reading before this cursor.
 *
 * @returns Promise resolving to an object with:
 *   - `data`: array of documents of type T
 *   - `lastDoc`: Firestore document snapshot for pagination
 *
 * @example
 * // 1. Simple filter
 * const { data } = await getCollectionData<User>("users", {
 *   where: [["role", "==", "admin"]],
 * });
 *
 * @example
 * // 2. Filter + ordering + limit
 * const { data } = await getCollectionData<User>("users", {
 *   where: [["status", "==", "active"]],
 *   orderBy: [["createdAt", "desc"]],
 *   limit: 10,
 * });
 *
 * @example
 * // 3. Pagination using startAfter
 * const { data, lastDoc } = await getCollectionData<User>("users", {
 *   orderBy: [["createdAt", "desc"]],
 *   limit: 5,
 * });
 * const nextPage = await getCollectionData<User>("users", {
 *   orderBy: [["createdAt", "desc"]],
 *   limit: 5,
 *   startAfter: lastDoc,
 * });
 */
export async function getCollectionData<T = DocumentData>(
  collectionName: COLLECTIONS,
  options: FirestoreQueryOptions<T> = {},
): Promise<{ data: WithId<T>[]; lastDoc: any }> {
  if (typeof window === "undefined") {
    return getServerData<T>(collectionName, options);
  } else {
    return getClientData<T>(collectionName, options);
  }
}
