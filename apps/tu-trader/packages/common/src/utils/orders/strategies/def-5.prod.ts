/**
 * WORKS BEST WITH THE 5min TIMEFRAME ON BYBIT
 */

import { IBot } from "@pkg/cmn/models/bot";
import { IOrder } from "@pkg/cmn/models/order";
import {
    getBaseToSell,
    getBotPlat,
    getBotStrategy, 
} from "@pkg/cmn/utils/funcs2";
import { botLog } from "@pkg/cmn/utils/bend/functions";
import { ICandle } from "@pkg/cmn/utils/interfaces";
import { placeTrade } from "../funcs";
import { TuOrder } from "@pkg/cmn/models";
import { ceil, toFixed } from "@cmn/utils/funcs";

export const def5Prod = async ({
    pos,
    order,
    bot,
    row,
    prevrow,
    pxPr,
    basePr,
}: {
    order?: IOrder | null;
    bot: IBot;
    pos: boolean;
    row: ICandle;
    prevrow: ICandle;
    pxPr: number;
    basePr: number;
}) => {
    botLog(bot, def5Prod);

    const plat = getBotPlat(bot);
    const str = getBotStrategy(bot);
    
    let isSl = false,
            is_market = false;
    const { ts, o, h, l, c } = row;
    const isGreen = prevrow.c >= prevrow.o;
    let entry = order?._entry;
    const TRAIL = 0.1;
        
    const isO = prevrow.h == Math.max(prevrow.c, prevrow.o);
    const trail = ceil(prevrow.h * (1 - TRAIL / 100), pxPr);

    botLog(bot, { str, pos, trail, o, isO });

    if (!pos && str.buyCond(prevrow)) {
        botLog(bot, "KAYA RA BUY");

        const amt = bot.balance;
        entry = o;

        if (o < trail){
            const r = await placeTrade({
             bot: bot,
             ts,
             amt,
             side: "buy",
             price: entry,
             plat: plat,
             ordType: "Market",
         });
         if (!r) {
             return botLog(bot, "FAILED TO PLACE BUY ORDER");
         } 
         order = (await TuOrder.findById(r).exec())!;
         pos = true;
         }else{
             botLog(bot, "NOT PLACING BUY , OPEN >= TRAIL")
         }
         
    }

    if (order && pos && entry) {
        let exitLimit = 0;

        const e = Math.max(prevrow.o, prevrow.c);
        const T = 3.5, SL = .5
        exitLimit = e * (1 + T/ 100);

        isSl = !isGreen
        let exit = 0;

        const amt = toFixed(getBaseToSell(order), basePr);
        const _sl = ceil(entry * (1 - SL/100),pxPr)
        const minTP = entry * (1 + 1 / 100);
        const openCond = (o >= trail && isO) || o > minTP;
        
        if (openCond){
            exit  = o
            is_market = true
        }
        else{
            exit = exitLimit
            isSl = true
        }

        botLog(bot, { exit, base: amt, isSl, _sl, is_market });

        if (exit != 0 && (isSl || exit >= _sl)) {
            if (is_market) {
                botLog(bot, "PLACING MARKET SELL AT OPEN");
                const r = await placeTrade({
                    bot: bot,
                    ts,
                    amt: Number(amt),
                    side: "sell",
                    plat: plat,
                    price: exit,
                    ordType: "Market",
                });

                if (!r) {
                    return botLog(bot, "COULD NOT PLACE SELL ORDER");
                }
                botLog(bot, "SELL ORDER PLACED");
            } else {
                botLog(bot, "PLACING LIMIT SELL AT EXIT_LIMIT");

                const r = await placeTrade({
                    bot: bot,
                    ts,
                    amt: Number(amt),
                    side: "sell",
                    plat: plat,
                    price: exit,
                    ordType: "Limit",
                });

                if (!r) {
                    return botLog(bot, "COULD NOT PLACE SELL ORDER");
                }
                botLog(bot, "SELL ORDER PLACED");
            }
        }
    }
};
/* 
export const prodStrategy = async ({pos, order, bot}: {order?: IOrder | null, bot: IBot, pos: boolean, row: ICandle, prevrow: ICandle}) =>{
    botLog(bot, prodStrategy)
}
 */
