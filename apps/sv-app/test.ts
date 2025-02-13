import { realpathSync } from "fs";

console.log(realpathSync(import.meta.resolve("@repo/common/package.json")));