import { svTool, findTurboRoot } from "@repo/ui/src/lib/server/sv-tool";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
const __dirname = import.meta.dirname
const cwd = path.dirname(__dirname);
console.log("\n[TU_SV_TOOL]", {cwd});
const rootDir =  findTurboRoot(cwd)
svTool({
    cwd,
    rootDir: rootDir,
    svConfigFile: path.join(__dirname, "svelte.config.js"),
    viteConfigFile: path.join(__dirname, "vite.config.ts"),
    incl: ["mathlive/dist/fonts", "mathlive/dist/sounds"].map(el=>path.join(rootDir, "node_modules", el))
    
});

const updateTwConfig = () =>{

    const fname = "tailwind.config.ts"
    const twConfigPath = path.join(cwd, fname )
    console.log("\nUpdating tailwind.config...");
    const config = readFileSync(path.join(__dirname, fname), {encoding: "utf-8"})
    writeFileSync(twConfigPath, config)
    console.log("TailwindConfig updated!!", twConfigPath);
}

updateTwConfig()