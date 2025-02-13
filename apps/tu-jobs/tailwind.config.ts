
import {twConfig} from '@repo/ui/src/tailwind.config'
export default twConfig(__dirname, 'next')
// import path, { dirname } from "path";
// import type { Config } from "tailwindcss";
// import daisyThemes from "daisyui/src/theming/themes";
// import daisyUI from "daisyui";


// const themes = {
//     dark: [
//         "dark",
//         // "synthwave",
//         // "halloween",
//         // "forest",
//         // "aqua",
//         // "black",
//         // "luxury",
//         // "dracula",
//         // "business",
//         // "night",
//         // "coffee",
//         // "dim",
//         // "sunset",
//     ],
//     light: [
//         "light",
//         // "cupcake",
//         // "bumblebee",
//         // "emerald",
//         "corporate",
//         "retro",
//         // "cyberpunk",
//         // "velentine",
//         // "garden",
//         // "lofi",
//         // "pastel",
//         // "fantasy",
//         // "wireframe",
//         // "cmyk",
//         // "autumn",
//         // "acid",
//         // "lemonade",
//         // "winter",
//         // "nord",
//     ],
// };
// // export {}
// // const __dirname = import.meta.dirname;
    
//     const exts = "{html,js,ts,jsx,tsx,mdx,jsx}"
//     // const uiDir = framework == "next" ? "{html,js,ts,jsx,tsx,mdx}" : "{html,js,svelte,ts}";
//     const uiDir = "../ui"
//     export default {

//         content: [
//                `./src/**/*.${exts}`,
//                `./src/apps/**/*.${exts}`,
//                `./src/pages/**/*.${exts}`,
//             path.join(uiDir, `src/**/*.${exts}`),
//         ],
//         // darkMode: true,
//         theme: {
//             extend: {},
//         },

//         daisyui: {
//             themes: [
//                 ...themes.dark, ...themes.light,
//                 {
//                     tu_retro:{...daisyThemes["retro"], secondary: "#009d92"},
//                     tb: {
//                         ...daisyThemes["[data-theme=tb]"],
//                         primary: "rgb(74, 222, 128)", //"#ffa500",
//                         secondary: "#f6d860",
//                         accent: "#ecb847",
//                         neutral: "#181818",
//                         ".bg-2": {
//                             "background-color": "#202020",
//                         },
//                         dark: "#292828",
//                         "base-100": "#111111",
//                     },
                    
//                 },
               
//             ],
//         },
//         plugins: [daisyUI],
//     } as Config;


// export default twConfig(__dirname)
