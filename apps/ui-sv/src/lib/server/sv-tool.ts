import path, { dirname } from "path";
import { SvelteTool } from "./sv-tool-class";
const clearTerminal = () => {
    process.stdout.write("\x1Bc");
};


/**
 * 
 * @param incl /absolute/path/to folders/files to include
 */
export function svTool({
    cwd,
    rootDir,
    svConfigFile,
    viteConfigFile,
    packages = {},
    dirs = [],
    incl = []
}: {
    cwd: string;
    rootDir: string;
    packages?: { [k: string]: string };
    dirs?: string[];
    svConfigFile: string;
    viteConfigFile: string;
    incl?: string[]
}) {
    console.log({ rootDir, cwd });
    for (let [k, v] of Object.entries({
        "@cmn/*": "@repo/common",
        "@repo/ui-sv/*": "@repo/ui-sv",
        "@repo/ui/*": "@repo/ui",
    })){
        packages[k] = v 
    }
    try {
        const oldPackages = packages;
        packages = {};

        for (const [key, val] of Object.entries(oldPackages)) {
            console.log({val});
            packages[key] = path.relative(
                cwd,
                dirname(import.meta.resolve(val + "/package.json").replace("file://", ""))
            ) + "/src/*";
        }

        let dirsToInclude = ["@repo/ui/src/styles/fonts", ...dirs].map((el) => {
            const splitDir = el.split("/");
            const pkg = splitDir.slice(0, 2).join("/");
            const folds = splitDir.slice(2).join("/");
            // console.log({ pkg, folds });
            const pth = path.relative(
                ".",
                [
                    dirname(import.meta.resolve(pkg + "/package.json").replace("file://", "")),
                    folds,
                ].join("/")
            );
            
            // const pth = [
            //     dirname(import.meta.resolve(pkg).replace("file://", "")),
            //     folds,
            // ].join("/")
            console.log(pth, '\n');
            return pth
        });
        // console.log({ packages, dirsToInclude })
        const svTool = new SvelteTool({
            rootDir,
            cwd,
            packages,
            dirs: [...dirsToInclude],
            svConfigFile,
            viteConfigFile,
            incl
        });
        svTool.main();
         clearTerminal()
    } catch (err) {
        console.log(err);
       
    }finally{
        
    }
}

import fs from "node:fs"
// import { clearTerminal } from "@cmn/utils/funcs";
 function _findTurboRoot(startDir: string) {
    let currentDir = startDir;

    while (currentDir !== path.parse(currentDir).root) {
        if (fs.existsSync(path.join(currentDir, "turbo.json"))) {
            return currentDir;
        }

        const packageJsonPath = path.join(currentDir, "package.json");
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, "utf8")
            );
            if (packageJson.workspaces || packageJson.dependencies?.["turbo"]) {
                return currentDir;
            }
        }

        currentDir = path.dirname(currentDir); // Move up a directory
    }

    throw new Error("Turborepo root not found");
}

export const findTurboRoot = (startDir = process.cwd() ) => path.relative(startDir, _findTurboRoot(startDir))