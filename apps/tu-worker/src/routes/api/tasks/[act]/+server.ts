import { taskManager } from "@cmn/classes/task-manager.js";
import { timedLog } from "@cmn/utils/funcs.js";

export const POST = async ({ params, request: req }) => {
    const { act } = params;
    const { id } = await req.json();
    const tasks = taskManager.tasks.filter((el) => !id || id == el.id);

    for (let task of tasks) {
        timedLog(`\n[TASK] ${task.name}`);
        if (act == "run") {
            taskManager.pauseTask(task.id);
            task.cb(task.id).then((r) => {
                if (r) taskManager.resumeTask(task.id);
            });
        }
    }

    return new Response("Ok")
};
