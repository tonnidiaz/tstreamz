import path from "path";

// const flowbiteReact = require("flowbite-react/tailwind")
const uiNextDir = require.resolve("@mobile/ui-next/package.json");
const exts = "{js,ts,jsx,tsx,mdx}";
const folders = [uiNextDir].map((el) =>
    path.dirname(path.relative(__dirname, el)) + `/src/**/*.${exts}`
);
console.log({folders});
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        `./src/**/*.${exts}`,
        "./node_modules/preline/preline.js",
        ...folders
    ],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("preline/plugin"),
    ],
};
