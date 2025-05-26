# 🧩 Ra Next.js API Architecture Pattern

A scalable and maintainable pattern for building clean, testable API routes using Next.js App Router.

---

## 📂 Folder Structure (per endpoint)

```
src/app/api/[resource-name]
├── route.ts # HTTP method entry point (routing only)
├── controller.ts # Orchestrates request, validation, error handling
├── handler.ts # Business logic (pure logic, throws on error)
├── schema.ts # Zod schema + inferred types for request validation
```

---

## 🧠 Core Principles

| Responsibility   | File            | Notes                                               |
| ---------------- | --------------- | --------------------------------------------------- |
| HTTP entry point | `route.ts`      | Pure routing: `GET`, `POST`, etc. only              |
| Request control  | `controller.ts` | Parses input, checks auth/IP, returns response      |
| Business logic   | `handler.ts`    | Executes domain logic, returns plain data or throws |
| Validation types | `schema.ts`     | Defines and infers request payload types            |
| Typed responses  | `response.ts`   | Unified success/error formatting                    |
| Logging          | `logger.ts`     | Env-aware, scoped logging with `LOG_KEYS`           |
| Custom errors    | `error.type.ts` | `UnauthorizedError`, `ValidationError`, etc.        |

---

## 🛠 API Response Format

All responses conform to a consistent type:

```ts
type ApiSuccessResponse<T> = {
  data: T;
  message: string;
};

type ApiErrorResponse = {
  error: string;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

### 🧪 Example: POST /api/postmark/webhook

route.ts

```ts
import { controlPostmarkWebhook } from "@/app/api/postmark/webhook/controller";

export const POST = controlPostmarkWebhook;
```

---

controller.ts

```ts
import { handlePostmarkWebhook } from "@/app/api/postmark/webhook/handler";
import {
  postmarkWebhookSchema,
  PostmarkWebhookPayload,
} from "@/app/api/postmark/webhook/schema";
import { catchControllerError, ok } from "@/utils/response";
import { ValidationError } from "@/types/error.type";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";

export async function controlPostmarkWebhook(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<PostmarkWebhookPayload>>> {
  try {
    const body = await request.json();
    const validation = postmarkWebhookSchema.safeParse(body);
    if (!validation.success) throw new ValidationError("Invalid payload");

    const result = await handlePostmarkWebhook(validation.data);
    return ok(result);
  } catch (error) {
    return catchControllerError(error);
  }
}
```

---

handler.ts

```ts
import type { PostmarkWebhookPayload } from "./schema";

export async function handlePostmarkWebhook(data: PostmarkWebhookPayload) {
  // Business logic goes here
  return {
    processed: true,
    from: data.From,
  };
}
```

---

schema.ts

```ts
import { z } from "zod";

export const postmarkWebhookSchema = z.object({
  From: z.string().email(),
  Subject: z.string(),
});

export type PostmarkWebhookPayload = z.infer<typeof postmarkWebhookSchema>;
```

---

### 🚀 Generator

You can scaffold a new endpoint using:

`npm run gen-api postmark/webhook`

This creates a full API folder pre-wired to this architecture.

---

### ✅ Benefits

- 📦 Clean separation of concerns
- 🧪 Easy to unit test logic, handlers, and schemas
- 🔒 Strong input validation via Zod
- 🔁 Consistent typed responses
- 🔍 Centralized logging and error handling

---

### 🧱 Optional Add-ons

- LOG_KEYS.ts for structured logging
- withAuth middleware for secure APIs
- tests/ folder for handlers + controllers
- Auto-registration in OpenAPI from Zod schemas (future)

---

### ✨ Naming Conventions

- control<Name> → in controller
- handle<Name> → in handler
- <name>Schema / <Name>Payload → in schema

---

### 🙌 Authors & Credits

Maintained by Cheng and team. Designed for high-scalability in multi-tenant or modular Next.js projects.
