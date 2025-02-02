"use server";
// import path from "node:path";
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        console.log("[Instrumentation] BEGIN");
        try {
            const { runOnce } = await import("./utils/server/funcs");
            await runOnce();
        } catch (err) {
            console.log("[INSTRUMENTATION] ERROR", err.message);
        }
    }
}
