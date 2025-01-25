import { sleep, timedLog } from "@cmn/utils/funcs";
import { handleError } from "@repo/ui/hooks.server";
import { scheduleAllTasks } from "./lib/server/funcs"; 
import { globalJobScheduled, setGlobalJobScheduled, taskManager } from "@cmn/classes/task-manager";
import { scrapeWWEVideos } from "./lib/server/tasks";
import { dev } from "$app/environment";
export { handleError };

const main = async () => {
    // clearTerminal()
    timedLog("RUN ONCE", {globalJobScheduled});
    // if (dev) return;
    // Clear any left over tasks
    taskManager.clearTasks()
    // Schedule tasks
    taskManager.addTask({
        name: "WWE scraper!",
        id: `task-wwe-scraper`,
        desc: "Scrapes wwe videos for the tu-wwe app at the beginning of every new day.",
        interval: 24 * 60,
        cb: async (id) => await scrapeWWEVideos(),
        active: true,
    });

    taskManager.addTask({
        name: "PastPaperScraper",
        id: "tu-edu-paper-scraper",
        desc: "scrapes past papers for the tu-edu app at the beginning of every new day.",
        interval: 2,
        active: true,
        cb: async()=>{
            console.log(`[PastPaperScraoer] Scraping past papers...`);
            await sleep(5000)
            console.log(`[PastPaperScraoer] Done scraping past papers`);
            return true
        }
    })
    if (!globalJobScheduled){
        setGlobalJobScheduled(true)
        await scheduleAllTasks();}
    
};

main();
 