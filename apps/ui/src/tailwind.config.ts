import path, { dirname } from "path";
import type { Config } from "tailwindcss";
import daisyThemes from "daisyui/src/theming/themes";
import daisyUI from "daisyui";


const themes = {
    dark: [
        "dark",
        // "synthwave",
        // "halloween",
        // "forest",
        // "aqua",
        // "black",
        // "luxury",
        // "dracula",
        // "business",
        // "night",
        // "coffee",
        // "dim",
        // "sunset",
    ],
    light: [
        "light",
        // "cupcake",
        // "bumblebee",
        // "emerald",
        "corporate",
        "retro",
        // "cyberpunk",
        // "velentine",
        // "garden",
        // "lofi",
        // "pastel",
        // "fantasy",
        // "wireframe",
        // "cmyk",
        // "autumn",
        // "acid",
        // "lemonade",
        // "winter",
        // "nord",
    ],
};
// export {}
// const __dirname = import.meta.dirname;
export const twConfig = (dir: string, framework: 'sv' | 'next' = 'sv') => {
    
    const exts = framework == "next" ? "{html,js,ts,jsx,tsx,mdx}" : "{html,js,svelte,ts}";
    // const uiDir = framework == "next" ? "{html,js,ts,jsx,tsx,mdx}" : "{html,js,svelte,ts}";
    console.log({ dir, framework, exts, __dirname });
    const _appsDir = (dirname(__dirname));
    const uiDir = path.join(_appsDir, `../ui-${framework}`)
    console.log({_appsDir, uiDir});
    return {

        content: [
               `./**/*.${exts}`,
            path.join(path.relative(dir, uiDir), `src/**/*.${exts}`),
        ],
        // darkMode: true,
        theme: {
            extend: {},
        },

        daisyui: {
            themes: [
                ...themes.dark, ...themes.light,
                {
                    tu_retro:{...daisyThemes["retro"], secondary: "#009d92"},
                    tb: {
                        ...daisyThemes["[data-theme=tb]"],
                        primary: "rgb(74, 222, 128)", //"#ffa500",
                        secondary: "#f6d860",
                        accent: "#ecb847",
                        neutral: "#181818",
                        ".bg-2": {
                            "background-color": "#202020",
                        },
                        dark: "#292828",
                        "base-100": "#111111",
                    },
                    
                },
               
            ],
        },
        plugins: [daisyUI],
    } as Config;
};

// export default twConfig(__dirname)
