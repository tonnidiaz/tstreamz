

import path, { dirname } from "path";
import type { Config } from "tailwindcss";
import daisyThemes from "daisyui/src/theming/themes";
import daisyUI from "daisyui";


// export {}
// const __dirname = import.meta.dirname;
export const twConfig = (dir: string) => {
    console.log({ dir });
    return {
        content: [
            path.join(path.relative(dir,__dirname) , "**/*.{html,js,svelte,ts}"),
            path.join(path.relative(dir, dir), "src/**/*.{html,js,svelte,ts}"),
        ],
        // darkMode: true,
        theme: {
            extend: {},
        },

        daisyui: {
            themes: [
                {
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
                "dark",
                "bumblebee",
                "halloween",
                "forest",
                "black",
                "business",
                "night",
                "dracula",
            ],
        },
        plugins: [daisyUI],
    } as Config;
};

// export default twConfig(__dirname)