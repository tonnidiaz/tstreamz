import { readFileSync, writeFileSync } from "fs";

const genFileAssociations = (
    iconName: string,
    exts: string[],
    type: "video" | "audio",
    role = "Editor"
) => {
    console.log("\nGenerating file associations");
    const res = exts.map((ext) => ({
        ext: ext,
        name: `${ext.toUpperCase()} Files`,
        description: `${ext.toUpperCase()} video files`,
        iconName,
        role,
    }));
    const wailsFilePath = "wails.json"

    const wailsFileContent = JSON.parse(readFileSync(wailsFilePath, {encoding: "utf-8"}))
    wailsFileContent.fileAssociations = res

    writeFileSync(wailsFilePath, JSON.stringify(wailsFileContent))
    console.log("Done generating file associations");
};

const main = () => {
    const exts = [
        "mp4",
        "mov",
        "avi",
        "wmv",
        "flv",
        "mkv",
        "webm",
        "ts",
        "m4v",
    ];
    genFileAssociations("tu-player", exts, "video")
};

main()