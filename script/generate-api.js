const fs = require("fs");
const path = require("path");

const resourceName = process.argv[2];

if (!resourceName) {
  console.error(
    "❌ Resource name required. Usage: npm run gen-api postmark/webhook",
  );
  process.exit(1);
}

const basePath = path.resolve(`./src/app/api/${resourceName}`);
if (fs.existsSync(basePath)) {
  console.error("❌ Resource already exists.");
  process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

const pascal = (str) =>
  str
    .split("/")
    .pop()
    .replace(/(^\w|-\w)/g, (s) => s.replace("-", "").toUpperCase());

const camel = (str) => {
  const p = pascal(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
};

const importBase = `@/app/api/${resourceName}`;

const files = {
  "route.ts": `
import { control${pascal(resourceName)} } from "${importBase}/controller";

export const POST = control${pascal(resourceName)};
`.trim(),

  "controller.ts": `
import { handle${pascal(resourceName)} } from "${importBase}/handler";
import {
  ${camel(resourceName)}Schema,
  ${pascal(resourceName)}Payload,
} from "${importBase}/schema";
import { catchControllerError, ok } from "@/utils/response";
import { ValidationError } from "@/types/error.type";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";

export async function control${pascal(resourceName)}(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<${pascal(resourceName)}Payload>>> {
  try {
    const body = await request.json();
    const validation = ${camel(resourceName)}Schema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError("Invalid payload");
    }

    const result = await handle${pascal(resourceName)}(validation.data);
    return ok(result);
  } catch (error) {
    return catchControllerError(error);
  }
}
`.trim(),

  "handler.ts": `
import type { ${pascal(resourceName)}Payload } from "${importBase}/schema";

export async function handle${pascal(resourceName)}(data: ${pascal(resourceName)}Payload) {
  // TODO: implement business logic
  return data;
}
`.trim(),

  "schema.ts": `
import { z } from "zod";

export const ${camel(resourceName)}Schema = z.object({
  exampleField: z.string(),
});

export type ${pascal(resourceName)}Payload = z.infer<typeof ${camel(resourceName)}Schema>;
`.trim(),
};

for (const [fileName, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(basePath, fileName), content + "\n");
}

console.log(`✅ Generated /api/${resourceName}`);
