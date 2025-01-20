import path, { dirname } from "node:path";
import fs from "node:fs";

export class SvelteTool {
    svConfigFile: string;
    viteConfigFile: string;
    cwd: string;
    packages: {[k: string]: string};
    dirs: string[];
    incl: string[];
    rootDir: string

    constructor({
        svConfigFile,
        viteConfigFile,
        cwd,
        packages = {},
        incl = [],
        dirs = [],
        rootDir
    }: {
        svConfigFile: string;
        viteConfigFile: string;
        rootDir: string;
        cwd: string;
        packages?: {[k: string]: string};
        dirs?: string[];
        incl?: string[]
    }) {
        this.svConfigFile = path.resolve(svConfigFile);
        this.viteConfigFile = path.resolve(viteConfigFile);
        this.cwd = cwd
        this.packages = packages
        this.dirs = dirs
        this.incl = incl
        this.rootDir = rootDir
    }

    getRawFieldsToAdd() {
        const rawFieldsToAdd = `
    alias: ${JSON.stringify({
        ...this.packages,
        "@/*": "src/*",
    })},
    typescript: {
        config: (c) => {
            return {
                ...c,

                include: [
                    ...c.include,
                    "**/*.ts",
                    "${path.join('../', this.rootDir, "node_modules/svelte/elements.d.ts")}",
                    "${Object.values(this.packages).map(el=> path.join('../', el)).join('", "')}",
                    "${this.incl.join('", "')}"
                ],
                exclude: [
                    ...c.exclude,
                    "../../../**/*.js",
                    "${path.join('../', this.rootDir, "node_modules")}",
                    "${path.join('../', this.rootDir, "**/**.spec.ts")}",
                    "${path.join('../', this.rootDir, "**/**.js")}",
                ],
            };
        },
    },
`;
        return rawFieldsToAdd;
    }

    modifySvelteConfig() {
        try {
            const rawFieldsToAdd = this.getRawFieldsToAdd();
            // Read the svelte.config.js file
            let svelteConfig = fs.readFileSync(
                this.svConfigFile,
                "utf8"
            );

            // Check if the `kit` field exists
            const kitFieldPattern = /kit:\s*{[^}]*}/;

            if (kitFieldPattern.test(svelteConfig)) {
                // If `kit` exists, add the raw fields
                svelteConfig = svelteConfig.replace(
                    kitFieldPattern,
                    (match) => {
                        // Ensure there is a trailing comma in the existing `kit` content
                        const updatedMatch = match.replace(
                            /}\s*$/,
                            `,\n${rawFieldsToAdd}}`
                        );
                        return updatedMatch;
                    }
                );
            } else {
                // If `kit` doesn't exist, add it
                svelteConfig = svelteConfig.replace(
                    /(export\s+default\s*{)/,
                    `$1\n  kit: {\n${rawFieldsToAdd}},`
                );
            }
            const savePath = path.join(this.cwd, "svelte.config.js")
            // Write the updated configuration back to the file
            fs.writeFileSync(savePath, svelteConfig, "utf8");
            console.log(
                `Svelte config updated successfully: ${savePath}`
            );
        } catch (error: any) {
            console.error(`Failed to update Svelte config: ${error.message}`);
        }
    }
    modifyViteConfig(directoryToAllow: string) {
        try {
            // Read the vite.config.js file
            let viteConfig = fs.readFileSync(this.viteConfigFile, "utf8");

            // Check if the configuration already includes `server.fs.allow`
            const fsAllowPattern =
                /server:\s*{[^}]*fs:\s*{[^}]*allow:\s*\[([^\]]*)]/;

            if (fsAllowPattern.test(viteConfig)) {
                // If `allow` already exists, append the new directory if not already present
                viteConfig = viteConfig.replace(
                    fsAllowPattern,
                    (match, allowList) => {
                        const dirs = allowList
                            .split(",")
                            .map((dir) => dir.trim().replace(/['"`]/g, ""));
                        if (!dirs.includes(directoryToAllow)) {
                            dirs.push(directoryToAllow);
                        }
                        const updatedAllowList = dirs
                            .map((dir) => `"${dir}"`)
                            .join(", ");
                        return match.replace(allowList, updatedAllowList);
                    }
                );
            } else {
                // If `allow` doesn't exist, add the configuration
                const serverConfigPattern = /server:\s*{[^}]*}/;
                if (serverConfigPattern.test(viteConfig)) {
                    // If `server` config exists, add `fs.allow`
                    viteConfig = viteConfig.replace(
                        serverConfigPattern,
                        (match) =>
                            match.replace(
                                /server:\s*{/,
                                `server: { fs: { allow: ["${directoryToAllow}"] } }, `
                            )
                    );
                } else {
                    // If `server` config doesn't exist, add it
                    console.log("{Server} does not exist");
                    viteConfig = viteConfig.replace(
                        /(export\s+default\s+defineConfig\(\s*{)/,
                        `$1 \n\tserver: { fs: { allow: ["${directoryToAllow}"] } }, `
                    );
                }
            }
            const savePath = path.join(this.cwd, "vite.config.ts")
            // Write the updated configuration back to the file
            fs.writeFileSync(savePath, viteConfig, "utf8");
            console.log(
                `Vite config updated succesrefSvelteConfigFilesfully: ${savePath}`
            );
        } catch (error: any) {
            console.error(`Failed to update Vite config: ${error.message}`);
        }
    }

    main(){
        this.modifySvelteConfig();
        for (let d of this.dirs)
            this.modifyViteConfig(d)
    }
}
