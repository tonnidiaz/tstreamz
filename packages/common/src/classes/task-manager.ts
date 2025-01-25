import { timedLog } from "@cmn/utils/funcs";
import { ITask } from "@cmn/utils/interfaces";

export class TaskManager {


    tasks: ITask[] = [];
    static instances: TaskManager[] = []

    constructor(){
        timedLog("\nINIT TASK_MANAGER\n")
        TaskManager.instances.push(this)
    }
    addTask(task: ITask) {
        this.tasks.push(task);
    }
    pauseTask(id: string) {
        this.tasks = this.tasks.map(el=>({...el, active: el.id == id ? false : el.active}))
    }
    resumeTask(id: string) {
        this.tasks = this.tasks.map(el=>({...el, active: el.id == id ? true : el.active}))
    }

    rmTask(id: string | undefined | null) {
        if (!id) return;
        timedLog(`Removing task ${id}....`);
        this.tasks = this.tasks.filter((el) => el.id != id);
        timedLog(`Task ${id} removed!!`);
    }

    clearTasks(){
        this.tasks = []
    }
}

export let globalJobScheduled = false
export const setGlobalJobScheduled = (val: boolean)=> globalJobScheduled = val;
export const taskManager = TaskManager.instances[0] || new TaskManager();