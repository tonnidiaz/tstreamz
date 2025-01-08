import path, { dirname } from "path";
import { SvelteTool } from "./sv-tool-class";

export function svTool({
    cwd,
    rootDir,
    svConfigFile,
    viteConfigFile,
    packages,
    dirs = [],
}: {
    cwd: string;
    rootDir: string;
    packages?: { [k: string]: string };
    dirs?: string[];
    svConfigFile: string;
    viteConfigFile: string;
}) {
    console.log({ rootDir, cwd });
    for (let [k, v] of Object.entries({
        "@cmn/*": "@repo/common/src",
        "@repo/ui/*": "@repo/ui/src",
    })){
        packages[k] = v
    }
    try {
        const oldPackages = packages;
        packages = {};

        for (const [key, val] of Object.entries(oldPackages)) {
            packages[key] = path.relative(
                cwd,
                dirname(import.meta.resolve(val).replace("file://", ""))
            );
        }

        let dirsToInclude = ["@repo/ui/src/styles/fonts", ...dirs].map((el) => {
            const splitDir = el.split("/");
            const pkg = splitDir.slice(0, 3).join("/");
            const folds = splitDir.slice(3).join("/");
            // console.log({ pkg, folds });
            return path.relative(
                ".",
                [
                    dirname(import.meta.resolve(pkg).replace("file://", "")),
                    folds,
                ].join("/")
            );
        });
        // console.log({ packages, dirsToInclude })
        const svTool = new SvelteTool({
            rootDir,
            cwd,
            packages,
            dirs: dirsToInclude,
            svConfigFile,
            viteConfigFile,
        });
        svTool.main();
    } catch (err) {
        console.log(err);
    }
}

import fs from "node:fs"
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