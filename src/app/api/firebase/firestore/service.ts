import { db } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Query,
} from "firebase-admin/firestore";

type WithId<T> = T & { id: string };

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

export const readDocument = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  id: string,
): Promise<WithId<T> | null> => {
  const ref = db.collection(collectionName).doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() } as WithId<T>;
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

// QUERY

type WhereClause = [
  field: string,
  op: FirebaseFirestore.WhereFilterOp,
  value: any,
];
type OrderByClause = [
  field: string,
  direction?: FirebaseFirestore.OrderByDirection,
];

interface QueryOptions<T extends DocumentData> {
  where?: WhereClause[];
  orderBy?: OrderByClause[];
  limit?: number;
  offset?: number;
  startAt?: unknown[];
  endAt?: unknown[];
  startAfter?: unknown[];
  endBefore?: unknown[];
  select?: (keyof T & string)[];
}

export const queryDocuments = async <T extends DocumentData>(
  collectionName: COLLECTIONS,
  options: QueryOptions<T> = {},
): Promise<WithId<T>[]> => {
  let ref = db.collection(collectionName) as unknown as Query<T>;

  if (options.select?.length) {
    ref = ref.select(...options.select) as unknown as Query<T>;
  }

  if (options.where) {
    for (const [field, op, value] of options.where) {
      ref = ref.where(field, op, value);
    }
  }

  if (options.orderBy) {
    for (const [field, direction] of options.orderBy) {
      ref = ref.orderBy(field, direction);
    }
  }

  if (options.limit) ref = ref.limit(options.limit);
  if (options.offset) ref = ref.offset(options.offset);
  if (options.startAt) ref = ref.startAt(...options.startAt);
  if (options.endAt) ref = ref.endAt(...options.endAt);
  if (options.startAfter) ref = ref.startAfter(...options.startAfter);
  if (options.endBefore) ref = ref.endBefore(...options.endBefore);

  const snapshot = await ref.get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as WithId<T>,
  );
};
