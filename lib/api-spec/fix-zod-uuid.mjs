/**
 * Post-processes orval-generated zod schemas to replace zod.uuid()
 * (Zod v4 API) with zod.string().uuid() (Zod v3 compatible).
 *
 * Run after: pnpm exec orval --config orval.config.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..", "..");

const targets = [
  resolve(root, "lib/api-zod/src/generated/api.ts"),
];

for (const file of targets) {
  const original = readFileSync(file, "utf8");
  const fixed = original.replaceAll("zod.uuid()", "zod.string().uuid()");
  if (fixed !== original) {
    writeFileSync(file, fixed, "utf8");
    console.log(`✓ Fixed zod.uuid() → zod.string().uuid() in ${file}`);
  }
}
