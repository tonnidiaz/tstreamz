import { existsSync } from "fs";

import { execa } from "execa";
import fs from "fs";
import path from "path";

let extension = "";
if (process.platform === "win32") {
    extension = ".exe";
}

const binDevFolder = "./binaries/dev";
const binProdFolder = "./binaries/prod";

async function main() {
    console.log(`\nBegin binaries tool...`)
    const rustInfo = (await execa("rustc", ["-vV"])).stdout;
    const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
    if (!targetTriple) {
        console.error("Failed to determine platform target triple");
    }
    console.log({targetTriple, extension});

    /**
     * Remove all binaries in binProdFolder
     * Loop through binaries in dev folder and copy to prod with new name
     *
     */

    if (existsSync(binProdFolder)) {
        for (let file of fs.readdirSync(binProdFolder)) {
            fs.rmSync(path.join(binProdFolder, file), { force: true });
        }
    }

    if (existsSync(binDevFolder)) {
        for (let file of fs.readdirSync(binDevFolder)) {
            const ext = path.extname(file);
            if (ext == extension.replace(".", "")) {
                console.log(`\nDoing file: [${file} ]for [${process.platform}]`);

                fs.copyFileSync(path.join(binDevFolder, file),
                    path.join(binProdFolder, file.replace(extension, "") + `-${targetTriple}${extension}`)
                );
            }
        }
    }else{
        console.log(`${binDevFolder} does not exist`);
    }

    console.log(`\nBinaries tool Done`)
}

main().catch((e) => {
    throw e;
});
