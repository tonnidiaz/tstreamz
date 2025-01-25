import { taskManager } from "@cmn/classes/task-manager.js";
import { timedLog } from "@cmn/utils/funcs.js";

import { type TaskAct } from "@/lib/interfaces";

export const POST = async ({ params, request: req }) => {
    let { act: _act } = params;
    const { id } = await req.json();
    const tasks = taskManager.tasks.filter((el) => !id || id == el.id);
    const act = _act as TaskAct;
    for (let task of tasks) {
        timedLog(`\n[TASK] [${act}] ${task.name}`);
        switch (act) {
            case "run":
                taskManager.pauseTask(task.id);
                task.cb(task.id).then((r) => {
                    if (r) taskManager.resumeTask(task.id);
                });
                break;
            case "pause":
                await taskManager.pauseTask(task.id);
                break;
            case "resume":
                await taskManager.resumeTask(task.id);
                break;
            case "remove":
                await taskManager.rmTask(task.id);
                break;
        }
    }

    return new Response("Ok");
};
