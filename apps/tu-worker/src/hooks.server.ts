import { timedLog } from "@cmn/utils/funcs";
import { handleError } from "@repo/ui/hooks.server";
import { scheduleAllTasks } from "./lib/server/funcs";
import { taskManager } from "@cmn/classes/task-manager";
import { scrapeWWEVideos } from "./lib/server/tasks";
export { handleError };

const main = async () => {
    // clearTerminal()
    timedLog("RUN ONCE");

    // Schedule tasks
    taskManager.addTask({
        name: "[tu-wwe] Scrape wwe videos",
        id: `task-wwe-scraper`,
        interval: 24 * 60,
        cb: async (id) => await scrapeWWEVideos(),
        active: true,
    });
    await scheduleAllTasks();
};

main();
