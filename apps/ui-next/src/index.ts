import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const uiPath = dirname(fileURLToPath(import.meta.url))