import { IOrderDetails, ICandle } from "./interfaces";
import {
    atr,
    ema,
    rsi,
    macd,
    stoch,
    stochasticOscillator,
    accelerationBands,
    sma,
} from "indicatorts";
import path from "node:path";
import { MAKER_FEE_RATE, SL, TP, useHaClose } from "./constants";
import { OrderDetails } from "okx-api";
import { IBot } from "@pkg/cmn/models/bot";
import { TuOrder } from "@pkg/cmn/models";
import { AccountOrderV5 } from "bybit-api";
import { IOrder } from "@pkg/cmn/models/order";
import { objPlats } from "./consts2";
import { objStrategies } from "@pkg/cmn/strategies";
import type { Order as GateOrder } from "gate-api";
import type { SpotOrder as KucoinOrder } from "kucoin-api";
import { SpotOrder } from "binance";
import { parseDate } from "@cmn/utils/funcs";
import { IObj } from "@cmn/utils/interfaces";

const o: IObj = {};
export const getExactDate = (interval: number) => {
    // Validate the interval
    if (interval <= 0) {
        throw new Error("Interval must be a positive number");
    }

    // Get the current date and time
    const now = new Date();

    // Calculate the number of milliseconds in the interval
    const intervalMs = interval * 60 * 1000;

    // Get the current time in milliseconds
    const nowMs = now.getTime();

    // Round down to the nearest interval
    const roundedMs = Math.floor(nowMs / intervalMs) * intervalMs;

    // Create a new Date object for the rounded time
    const roundedDate = new Date(roundedMs);

    // Return the ISO string of the rounded date
    return roundedDate;
};

/**
 * { fast: 12, slow: 45, signal: 92, profit: 3.21, trades: 90 }
 *
 * slow and signal begin at 2
 */
export const tuMacd = (
    df: ICandle[],
    slow: number = 12,
    fast: number = 8,
    signal: number = 39
) => {
    const def = false;
    const faster = true;
    const prices = df.map((el) => el[useHaClose ? "ha_c" : "c"]);

    const _macd = macd(prices, { slow, signal, fast });
    const histogram: number[] = [];
    for (let i = 0; i < _macd.macdLine.length; i++)
        histogram.push(_macd.macdLine[i] - _macd.signalLine[i]);
    return { ..._macd, histogram };
};
export const tuPath = (pth: string) => pth; // path.resolve(...pth.split("/"));

export const parseKlines = (
    klines: (string | number)[][],
    useInvalid: boolean = false, isForex: boolean = false
) => {
    if (!klines.length) return [];
    try {
        console.log(parseKlines, { len: klines.length });
        let invalid = false;
        let df: ICandle[] = [];
        const ha_o = 0,
            ha_h = 0,
            ha_l = 0,
            ha_c = 0;
        const interval = Math.floor(
            (Number(klines[1][0]) - Number(klines[0][0])) / 60000
        );
        console.log({ interval });

        for (let i = 0; i < klines.length; i++) {
            const k = klines[i];

            const [ts, o, h, l, c, v] = k.map((e) => Number(e));

            if (i > 0) {
                const prev = Number(klines[i - 1][0]),
                    curr = Number(klines[i][0]);
                    const estCurr = prev + interval * 60000
                const _diff = Math.floor((Number(curr) - Number(prev)) / 60000);
                const day = new Date(estCurr).getDay()
                // console.log({day, _diff});
                if (((!isForex || (day > 0 && day < 6)) && _diff !== interval)) {
                    invalid = true;
                    // console.log({
                    //     _diff,
                    //     i,
                    //     len: klines.length,
                    //     prev: parseDate(new Date(prev)),
                    //     curr: parseDate(new Date(curr)),
                    //     estCurr: parseDate(estCurr)
                    // });
                    // console.log("KLINE DATA INVALID");
                    if (!useInvalid) break;
                }
            }
            df.push({
                ts: parseDate(new Date(ts)),
                o,
                h,
                l,
                c,
                v,
                ha_o,
                ha_h,
                ha_l,
                ha_c,
            });
        }
        if (!invalid) console.log("\nKLINES OK\n");

        return df;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const heikinAshi = (df: ICandle[]) => {
    console.log("\nBEGIN HA\n");
    const ha: IObj[] = [];
    for (let i = 0; i < df.length; i++) {
        const prev: any = ha[i - 1] || df[i];

        const c = (df[i].o + df[i].h + df[i].l + df[i].c) / 4;
        const o = (prev.o + prev.c) / 2;
        const h = Math.max(df[i].h, o, c);
        const l = Math.min(df[i].l, o, c);
        const m = (df[i].h + df[i].l) / 2;
        ha.push({
            ts: df[i].ts,
            o: Number(o),
            h: Number(h),
            l: Number(l),
            c: Number(c),
            v: df[i].v,
        });
    }
    console.log("HA DONE");
    return df.map((el, i) => ({
        ...el,
        ha_o: ha[i].o,
        ha_h: ha[i].h,
        ha_l: ha[i].l,
        ha_c: ha[i].c,
    }));
};

export const tuCE1 = (
    df: ICandle[],
    { atrLen = 1, mult = 1.5 }: { atrLen?: number; mult?: number }
) => {
    const closings = df.map((el) => el.c),
        highs = df.map((el) => el.h),
        lows = df.map((el) => el.l);

    const _atr = atr(highs, lows, closings, { period: atrLen }).atrLine;
    let sir = 1;

    for (let i = 0; i < df.length; i++) {
        const ceClosings = closings.slice(i - atrLen, i);
        const long_stop = Math.max(...ceClosings) - _atr[i] * mult;
        const short_stop = Math.max(...ceClosings) + _atr[i] * mult;
        df[i] = { ...df[i], long_stop, short_stop };

        const cdf = df[i],
            pdf = df[i - 1];

        if (i > 0) {
            const lsp = pdf.long_stop;
            const ssp = pdf.short_stop;
            if (closings[i - 1] > lsp)
                df[i].long_stop = Math.max(cdf.long_stop, pdf.long_stop);
            if (closings[i - 1] < ssp)
                df[i].short_stop = Math.min(cdf.short_stop, pdf.short_stop);

            if (closings[i] > ssp) sir = 1;
            else if (closings[i] < lsp) sir = -1;

            df[i].sir = sir;
            df[i].ceLong = Number(cdf.sir == 1 && pdf.sir == -1);
            df[i].ceShort = Number(cdf.sir == -1 && pdf.sir == 1);
        }
    }
    return df;
};
export const tuCE = (df: ICandle[], _fast?: number, _slow?: number) => {
    const mult = 1.5,
        atrLen = 1;
    const opens = df.map((e) => e[useHaClose ? "ha_o" : "o"]);
    const highs = df.map((e) => e[useHaClose ? "ha_h" : "h"]);
    const lows = df.map((e) => e[useHaClose ? "ha_l" : "l"]);

    const closings = df.map((e) => e[useHaClose ? "ha_c" : "c"]);

    console.log("BEGIN CE...");

    const ATR = atr(highs, lows, closings, { period: atrLen });
    const _atr = ATR.atrLine;
    const rsiLen = 2,
        fastLen = 20, // 10,//_fast ?? 15, //89 /* 15 */,
        slowLen = 50; // 25//_slow ?? 33; //90; /* 50 */
    // const useOpen = Math.max(...opens) < Math.max(...closings);
    const sma20 = ema(closings, { period: fastLen });
    const sma50 = ema(closings, { period: slowLen });

    const _rsi = rsi(closings, { period: rsiLen });
    const _stoch = stoch(highs, lows, closings, { dPeriod: 1, kPeriod: 2 });
    const _accelerationBands = accelerationBands(highs, lows, closings, {});

    let sir = 1;

    const { histogram, macdLine, signalLine } = tuMacd(df);

    for (let i = 0; i < df.length; i++) {
        df[i].sma_20 = sma20[i];
        df[i].sma_50 = sma50[i];
        /* MACD */
        df[i].hist = histogram[i];
        df[i].macd = macdLine[i];
        df[i].signal = signalLine[i];
        /* END MACD */
        df[i]["rsi"] = _rsi[i];

        df[i].stoch_k = _stoch.k[i];
        df[i].stoch_d = _stoch.d[i];

        df[i].accs_lower = _accelerationBands.lower[i];
        df[i].accs_middle = _accelerationBands.middle[i];
        df[i].accs_upper = _accelerationBands.upper[i];
        //continue
        const ceClosings = closings.slice(i - atrLen, i);
        const long_stop = Math.max(...ceClosings) - _atr[i] * mult;
        const short_stop = Math.max(...ceClosings) + _atr[i] * mult;
        df[i] = { ...df[i], long_stop, short_stop };

        const cdf = df[i],
            pdf = df[i - 1];

        if (i > 0) {
            const lsp = pdf.long_stop;
            const ssp = pdf.short_stop;
            if (closings[i - 1] > lsp)
                df[i].long_stop = Math.max(cdf.long_stop, pdf.long_stop);
            if (closings[i - 1] < ssp)
                df[i].short_stop = Math.min(cdf.short_stop, pdf.short_stop);

            if (closings[i] > ssp) sir = 1;
            else if (closings[i] < lsp) sir = -1;

            df[i].sir = sir;
            df[i].buy_signal = Number(cdf.sir == 1 && pdf.sir == -1);
            df[i].sell_signal = Number(cdf.sir == -1 && pdf.sir == 1);
        }
    }

    console.log("CE DONE");
    return df.map((el) => el);
};

export const calcEntryPrice = (row: ICandle, side: "buy" | "sell") => {
    const val = row.c;
    return val;
};

export const calcSL = (entry: number) => {
    return entry * (1 - SL / 100);
};
export const calcTP = (entry: number) => entry * (1 + TP / 100);
export const getInterval = (m: number, plt: string) => {
    let interval = `${m}`;

    switch (plt) {
        case "okx":
            interval = m >= 60 ? `${Math.floor(m / 60)}H` : `${m}m`;
            break;

        case "gateio":
            interval = m >= 60 ? `${Math.floor(m / 60)}h` : `${m}m`;
            break;
        case "bitget":
            interval = m >= 60 ? `${Math.floor(m / 60)}h` : `${m}min`;
            break;
        case "kucoin":
            interval = m >= 60 ? `${Math.floor(m / 60)}hour` : `${m}min`;
            break;
        case "mexc":
            interval = `${m}m`;
            break;
        default:
            interval = m >= 60 ? `${Math.floor(m / 60)}h` : `${m}m`;
            break;
    }

    return interval as any;
};

const testMexcOrderRes = {
    symbol: "LTCBTC",
    orderId: 1,
    orderListId: -1,
    clientOrderId: "myOrder1",
    price: "0.1",
    origQty: "1.0",
    executedQty: "0.0",
    cummulativeQuoteQty: "0.0",
    status: "NEW",
    timeInForce: "GTC",
    type: "LIMIT",
    side: "BUY",
    stopPrice: "0.0",
    time: 1499827319559,
    updateTime: 1499827319559,
    isWorking: true,
    origQuoteOrderQty: "0.000000",
};

type MexcOrder = typeof testMexcOrderRes;

/**
 * fillSz is the base
 */
export const parseFilledOrder = (res: IObj, plat: string) => {
    let data: IOrderDetails;
    
    if (plat == "okx") {
        res = res as OrderDetails;
        data = {
            id: res.ordId,
            fillPx: Number(res.avgPx),
            fillSz: Number(res.accFillSz),
            fee: Number(res.fee),
            fillTime: Number(res.fillTime),
            cTime: Number(res.cTime),
        };
    } else if (plat == "bybit") {
        res = res as AccountOrderV5;
        data = {
            id: res.orderId,
            fillPx: Number(res.avgPrice),
            fillSz: Number(res.cumExecQty),
            fee: Number(res.cumExecFee),
            fillTime: Number(res.updatedTime),
            cTime: Number(res.createdTime),
        };
    } else if (plat == "binance") {
        const _res = res as SpotOrder;
        data = {
            id: `${_res.orderId}`,
            fillPx: Number(_res.price),
            fillSz: Number(_res.executedQty),
            fee: 0,
            fillTime: Number(_res.updateTime),
            cTime: Number(_res.time),
        };
        data.fee = data.fillSz * (MAKER_FEE_RATE);
    } else if (plat == "bitget") {
        const feeDetail = JSON.parse(res.feeDetail);
        data = {
            id: res.orderId,
            fillPx: Number(res.priceAvg),
            fillSz: Number(res.baseVolume),
            fee: Number(feeDetail.newFees.t),
            fillTime: Number(res.uTime),
            cTime: Number(res.cTime),
        };
    } else if (plat == "mexc") {
        const _r = res as MexcOrder;
        const fillPx = Number(_r.cummulativeQuoteQty) / Number(_r.executedQty);
        data = {
            id: `${_r.orderId}`,
            fillPx,
            fillSz: Number(_r.executedQty),
            fee: Number(0),
            fillTime: Number(_r.updateTime),
            cTime: Number(_r.time),
        };
    } else if (plat == "kucoin") {
        const _res = res as KucoinOrder;
        const funds = Number(_res.dealFunds);
        const sz = Number(_res.dealSize);

        const price = Number(_res.price) || funds / sz;
        data = {
            id: _res.id!,
            fillPx: price,
            fillSz: sz,
            fee: Number(_res.fee),
            fillTime: Date.now(),
            cTime: Number(_res.createdAt),
        };
    } else {
        // GATEIO
        const _res = res as GateOrder;
        data = {
            id: _res.id!,
            fillPx: Number(_res.fillPrice!),
            fillSz: Number(_res.filledTotal),
            fee: Number(_res.fee),
            fillTime: Number(_res.updateTimeMs),
            cTime: Number(_res.createTimeMs),
        };
    }

    return data;
};

export const findBotOrders = async (bot: IBot) => {
    const orders = await TuOrder.find({
        bot: bot._id,
        base: bot.base,
        ccy: bot.ccy,
    }).exec();
    return orders;
};

export const getLastOrder = async (bot: IBot, pair: string[]) => {
    const orders = await TuOrder.find({
        bot: bot.id,
        base: pair[0],
        ccy: pair[1],
    }).exec();
    return orders.length ? [...orders].pop() : null;
};

export const getBotPlat = (bot: IBot) => {
    return new objPlats[bot.platform](bot);
};
export const getBotStrategy = (bot: IBot) => {
    return objStrategies[bot.strategy - 1];
};

export const orderHasPos = (order?: IOrder | null) => {
    return order != null && order.side == "sell" && !order.is_closed;
};
export const getBaseToSell = (order: IOrder) => {
    return order.base_amt - order.buy_fee;
};
