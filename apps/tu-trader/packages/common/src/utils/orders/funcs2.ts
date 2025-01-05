import { IOrder } from "@cmn/models/order";
import {
    tuCE,
    heikinAshi,
    parseKlines,
    orderHasPos,
    getLastOrder,
    getExactDate,
} from "../funcs2";
import { IBot } from "@cmn/models/bot";
import { Bot } from "@cmn/models";
import { placeTrade } from "./funcs";
import {
    getCoinPrecision,
    getPricePrecision,
    timedLog,
    toFixed, parseDate
} from "../functions";
import { botLog } from "@cmn/utils/bend/functions";
import { ICandle, IOrderDetails } from "../interfaces";
import { objPlats } from "../consts2";
import { DEV } from "../constants";
import { Bybit } from "@cmn/classes/bybit";
import { ImprProd } from "./strategies/impr.prod";
import { afterOrderUpdateArbit } from "./funcs3";
import mongoose from "mongoose";

//import { wsOkx } from "@cmn/classes/main-okx";

const useDef5 = false,
    useDef60 = true;

export const afterOrderUpdate = async ({
    bot,
}: {
    bot: IBot;
}): Promise<mongoose.Types.ObjectId | undefined | void | null> => {
    const is_arb = bot.type == "arbitrage";

    if (is_arb) return afterOrderUpdateArbit({ bot });

    const plat = new objPlats[bot.platform](bot);
    //await sleep(500)
    botLog(bot, "SIM: GETTING KLINES...");

    const end = getExactDate(bot.interval);

    const klines = await plat.getKlines({ end: end.getTime() });
    //const o = await plat.getTicker()
    if (!klines) return console.log("FAILED TO GET KLINES");
    //if (!o) return console.log("FAILED TO GET TICKER");

    let df = parseKlines(klines);
    let prevrow = df[df.length - 2];
    let row: ICandle = df[df.length - 1];
    botLog(bot, { prevrow: prevrow.ts, row: row.ts });
    if (prevrow.v == 0) {
        botLog(bot, "VOL: SKIPPING");
        return;
    }
    df = tuCE(heikinAshi(df));

    const pxPr = getPricePrecision([bot.base, bot.ccy], bot.platform);
    const basePr = getCoinPrecision([bot.base, bot.ccy], "limit", bot.platform);

    if (pxPr == null || basePr == null) return;

    prevrow = df[df.length - 2];
    row = df[df.length - 1]; //{ts: parseDate(end), o, h: o, l:o, c: o, v: prevrow.v, ha_o: o,ha_h: o, ha_l:o, ha_c: o };

    let order = await getLastOrder(bot, [bot.base, bot.ccy]);
    let pos = orderHasPos(order);

    botLog(bot, { ts: row.ts, o: row.o });

    if (DEV) return;

    const params = { row, prevrow, bot, order, pos, pxPr, basePr };
    //await cloud5Prod(params)
    //await def5Prod(params);
    return await ImprProd(params);

    // if (useDef5) {
    //     await prodStr5(params);
    // } else if (useDef60) {
    //     await prodStr60({ row, prevrow, bot, order, pos, pxPr, basePr });
    // }
};

export const updateBuyOrder = async (
    order: IOrder,
    res: IOrderDetails,
    tradeNum?: number
) => {
    const ts = {
        i: order.buy_timestamp?.i,
        o: parseDate(new Date(res.fillTime)),
    };
    console.log("TS", ts); 
    const fee = res.fee;
    let base_amt = res.fillSz;
    order.buy_order_id = res.id;
    order.buy_price = res.fillPx;
    order.buy_fee = Math.abs(fee);
    order.base_amt = base_amt;
    //order.new_ccy_amt = res.fillSz * res.fillPx;
    order.side = "sell";
    order.buy_timestamp = ts;
    await order.save();
    console.log("BUY ORDER UPDATED");
};
export const updateSellOrder = async (
    order: IOrder,
    res: IOrderDetails,
    bot: IBot
) => {
    const fee = Math.abs(res.fee); // In USDT

    /* Buy/Base fee already removed when placing sell order  */
    order.new_ccy_amt = res.fillSz * res.fillPx;
    order.sell_price = res.fillPx;
    order.is_closed = true;
    order.sell_fee = fee;
    order.sell_timestamp = {
        i: order.sell_timestamp?.i,
        o: parseDate(new Date(res.fillTime)),
    };
    /* order == currentOrder */
    const pxPr =
        getPricePrecision([bot.base, bot.ccy], bot.platform) ?? Infinity;
    const bal = toFixed(order.new_ccy_amt - Math.abs(res.fee), pxPr);
    const profit =
        !order.buy_order_id || order.buy_order_id.length == 0
            ? 0
            : ((order.sell_price - order.buy_price) / order.buy_price) * 100; // ((bal - order.ccy_amt) / order.ccy_amt * 100) ;

    order.profit = toFixed(profit, 2);
    order.order_id = res.id;
    await order.save();
    bot.balance = bal;
    bot.balCcy = bot.ccy
    await bot.save()
    if (bot.parent){
        await Bot.findByIdAndUpdate(bot.parent, {balance: bal, balCcy: bot.ccy}).exec()
    }
    console.log("SELL ORDER UPDATED");
};

const updateBotAtClose = async (bot: IBot, order: IOrder, c: number) => {
    try {
        timedLog("TIMED: UPDATE AT CLOSE");

        const pos = true;
        timedLog("TIMED: ", { sell_px: order?.sell_price, pos });

        const { sell_price } = order;
        const plat = new Bybit(bot);
        timedLog({ ticker: c });
        const _tp = order.tp;

        if (sell_price < c && sell_price >= _tp) {
            botLog(
                bot,
                `TIMED: PLACING MARKET SELL ORDER AT CLOSE SINCE IT IS > STOP_PX`,
                { ts: parseDate(new Date()), c, sell_price, _tp }
            );
            const amt = order.base_amt - order.buy_fee;
            const r = await placeTrade({
                bot: bot,
                ts: parseDate(new Date()),
                amt: Number(amt),
                side: "sell",
                plat: plat,
                price: 0,
                ordType: "Market",
            });
            if (!r)
                return botLog(bot, "TIMED: FAILED TO PLACE MARKET SELL ORDER");
            botLog(bot, "TIMED: MARKET SELL PLACED. BOT REMOVED");
            return false;
        } else {
            timedLog("CLOSE PRICE NOT > SELL_PX", { c, _tp, sell_price });
            return true;
        }
    } catch (e) {
        console.log(e);
    }
};
