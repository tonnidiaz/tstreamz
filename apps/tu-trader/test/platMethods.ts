import { clearTerminal } from "@cmn/utils/funcs"
import { Bot } from "@pkg/cmn/models"
import { objPlats } from "@pkg/cmn/utils/consts2"

const main = async () =>{
    clearTerminal()
    const bot = new Bot({name: "TuBot", platform: "kucoin", base: "SOL", ccy: "USDT", interval: 5, demo: false})
    const plat = new objPlats[bot.platform](bot)
    const r = await plat.getOrderbook()
    console.log(r);
}

main()