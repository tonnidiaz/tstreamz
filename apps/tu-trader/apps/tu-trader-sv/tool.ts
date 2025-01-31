import { svTool, findTurboRoot } from "@repo/ui-sv/src/lib/server/sv-tool";
import path from "path";
const cwd = import.meta.dirname;
svTool({
    cwd,
    rootDir: findTurboRoot(cwd),
    svConfigFile: path.join(cwd, "svelte.config.ref.js"),
    viteConfigFile: path.join(cwd, "vite.config.ref.ts"),
    packages: {"@pkg/cmn/*": "@tu-trader/common/src"}
});
