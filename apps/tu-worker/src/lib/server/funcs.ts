import { dev } from "$app/environment";
import { taskManager } from "@cmn/classes/task-manager";
import { handleErrs, timedLog, verifyCron } from "@cmn/utils/funcs";
import { jobSpecs } from "@cmn/utils/funcs2";
import { scheduleJob,  } from "node-schedule";

const globalJob = async () => {
    try {
        
        const now = new Date();
        const min = now.getMinutes();
        timedLog({ min, tasks: taskManager.tasks.length });
        for (let task of taskManager.tasks) {
            if (verifyCron(jobSpecs(task.interval), now)) {
                // temporarilly pause the task
                taskManager.pauseTask(task.id)
                task.cb(task.id).then(r=>{
                    if (r) taskManager.resumeTask(task.id)
                });
            }
        }
    } catch (err) {
        timedLog("[globalJob] Error")
        handleErrs(err)
    }
};

export async function scheduleAllTasks() {
    try {
        timedLog("Init global job...")
        scheduleJob(`job-${Date.now()}`, jobSpecs(1), globalJob);
    } catch (err) {
        timedLog("FAILED TO SCHEDULE ALL TASKS");
        handleErrs(err)
        
    }
}
