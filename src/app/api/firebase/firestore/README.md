# 🔥 Ra Firestore Admin Service

This service provides a reusable set of functions for CRUD operations on any Firestore collection using functional patterns with full TypeScript support.

---

### 📦 Setup

Ensure Firebase Admin SDK is initialized in `@/lib/firebase/admin.ts`:

```ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
};

if (!getApps().length) {
  initializeApp(firebaseAdminConfig);
}

export const db = getFirestore();
```

---

### 📁 Collections Enum

Use a central enum to manage collection names:

```ts
export enum COLLECTIONS {
  USERS = "users",
  JOBS = "jobs",
  APPLICATIONS = "applications",
  // Add more as needed
}
```

---

### ✅ Usage Examples

#### 1. Create Document

```ts
await createDocument(COLLECTIONS.USERS, "user_123", {
  name: "Alice",
  email: "alice@example.com",
});
```

---

#### 2. Read a Single Document

```ts
const user = await readDocument<{ name: string; email: string }>(
  COLLECTIONS.USERS,
  "user_123",
);
console.log(user?.name);
```

---

#### 3. Query Documents with Query Constraints

```ts
const users = await queryDocuments<User>(COLLECTIONS.USERS, {
  where: [["active", "==", true]],
  orderBy: [["createdAt", "desc"]],
  limit: 10,
});
```

```ts
const users = await queryDocuments<User>(COLLECTIONS.USERS, {
  select: ["name", "email"],
});
```

```ts
const users = await queryDocuments<User>(COLLECTIONS.USERS, {
  orderBy: [["createdAt", "desc"]],
  startAfter: [lastVisibleDoc.createdAt],
  limit: 10,
});
```

---

#### 4. Update Document

```ts
await updateDocument(COLLECTIONS.USERS, "user_123", {
  name: "Alice Updated",
});
```

---

#### 5. Delete Document

```ts
await deleteDocument(COLLECTIONS.USERS, "user_123");
```

---

#### 6. Upsert Document (Create or Merge)

```ts
await upsertDocument(COLLECTIONS.USERS, "user_123", {
  name: "Alice",
  updatedAt: new Date(),
});
```

#### 7. Add Document without ID

```ts
await addDocument(COLLECTIONS.USERS, {
  name: "Alice",
  email: "alice@example.com",
});
```

---

### 🔐 Type Safety

All generic types must extend DocumentData. Define your models like this:

```ts
type User = {
  name: string;
  email: string;
};

const users = await readDocuments<User>(COLLECTIONS.USERS);
```

---

### 💡 Best Practices

- ✅ Always type your documents explicitly using generics.
- ✅ Use the COLLECTIONS enum to avoid typos and inconsistencies.
- ✅ Prefer upsertDocument() when you want to insert or update depending on document existence.
- 🚫 Do not use this code on the client side — it’s server-only (uses Firebase Admin SDK).
