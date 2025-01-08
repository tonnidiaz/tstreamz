import path from "node:path";
import fs from "node:fs";

export function findTurboRoot(startDir = process.cwd()) {
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
