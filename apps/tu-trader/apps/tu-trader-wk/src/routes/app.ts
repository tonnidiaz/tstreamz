import { tunedErr } from "@/utils/funcs";
import { handleErrs } from "@cmn/utils/funcs";
import { TuConfig } from "@pkg/cmn/models";
import { taskManager } from "@pkg/cmn/utils/consts3";
import { addBooksTask } from "@pkg/cmn/utils/funcs4";
import { Router } from "express";

const router = Router()
router.post("/config", async function (req, res, next) {
    try {
        const body = req.body;
        const config = await TuConfig.findOne({}).exec();
        const oldInterval = config?.book_fetch_interval;

        const booksTask = taskManager.tasks.find(el=> el.id == 'task-books')
        if (oldInterval != body.book_fetch_interval) {
            console.log("CANCELLING OLD BOOK JOBS");
            taskManager.rmTask(booksTask?.id)
        }

        for (let k of Object.keys(body)) {
            const v = body[k];
            config?.set(k, v);
        }
        await config?.save();
        if (config?.fetch_orderbook_enabled) {
            console.log("RESCHEDULING BOOK JOBS");
            addBooksTask(config)
        } else {
            console.log("CANCELLING BOOK JOBS");
            taskManager.rmTask('task-books')
        }
        res.json(config?.toJSON());
    } catch (e) {
        handleErrs(e);
        return tunedErr(res, 500, 'Something went wrong')
    }
});

export default router
