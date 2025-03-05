import { useEffect, useState } from "react";
import TuSwitch from "./TuSwitch";

const TuThemeSwitcher = () => {
    const [mode, setMode] = useState<"light" | "dark" | null>(null);
    useEffect(() => {
        const mode = document.documentElement.classList.contains("dark")
            ? "dark"
            : "light";
        setMode(mode);
    }, []);

    useEffect(() => {
        if (mode != null) {
            const html = document.documentElement;
            if (mode == "dark" && !html.classList.contains("dark")) {
                html.classList.remove("light");
                html.classList.add("dark");
            } else if (mode == "light" && !html.classList.contains("light")) {
                html.classList.remove("dark");
                html.classList.add("light");
            }
        }
    }, [mode]);
    return <TuSwitch value={mode == "dark"} onChange={(val)=> setMode(val ? "dark" : "light")} />;
};

export default TuThemeSwitcher;
