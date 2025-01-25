import { taskManager } from '@cmn/classes/task-manager.js'
import { json } from '@sveltejs/kit'

export const GET = async({})=>{
    return json(taskManager.tasks)
}