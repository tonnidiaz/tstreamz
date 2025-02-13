import { svTool, findTurboRoot } from "@repo/ui-sv/src/lib/server/sv-tool";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
const __dirname = import.meta.dirname
const cwd = path.dirname(__dirname);

const updateTwConfig = () =>{

    const fname = "tailwind.config.ts"
    const twConfigPath = path.join(cwd, fname )
    console.log("\nUpdating tailwind.config...");
    const config = readFileSync(path.join(__dirname, fname), {encoding: "utf-8"})
    writeFileSync(twConfigPath, config)
    console.log("TailwindConfig updated!!", twConfigPath);
}

const main = () => {
    console.log("\n[TU_SV_TOOL]", { cwd });
    updateTwConfig();
    svTool({
        cwd,
        packages: {"@pkg/common/*": "@tu-trader/common", "@pkg/cmn/*": "@tu-trader/common"},
        rootDir: findTurboRoot(cwd),
        svConfigFile: path.join(__dirname, "svelte.config.js"),
        viteConfigFile: path.join(__dirname, "vite.config.ts"),
    });
};

main()