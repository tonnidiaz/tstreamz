import { fillBuyOrder, fillSellOrder } from "./utils/functions";
import {
    MAKER_FEE_RATE,
    PUT_ASIDE,
    SELL_AT_LAST_BUY,
    SL,
    TAKER_FEE_RATE,
    TP,
    WCS1,
    isMarket,
    rf,
    useAnyBuy,
    useSwindLow,
} from "@pkg/cmn/utils/constants";

import {
  
    getCoinPrecision,
    getMaxAmt,
    getMaxSz,
    getMinSz,
    getPricePrecision
} from "@pkg/cmn/utils/functions";
import { ICandle } from "@pkg/cmn/utils/interfaces";
import { strategy as strFbAdvanced} from "./funcs-test-fallback-advanced";
import { toFixed, ceil } from "@cmn/utils/funcs";
import { IObj } from "@cmn/utils/interfaces";
let _cnt = 0;

const d = useSwindLow ? 20 : 0;
export const strategy = ({
    df,
    balance,
    buyCond, sellCond,
    pair,
    maker = MAKER_FEE_RATE,
    taker = TAKER_FEE_RATE,
    trades,
    platNm,
}: {
    df: ICandle[];
    balance: number;
    buyCond: (row: ICandle, df?: ICandle[], i?: number) => boolean;
    sellCond: (
        row: ICandle,
        entry: number,
        df?: ICandle[],
        i?: number
    ) => boolean;
    pair: string[];
    maker: number;
    taker: number;
    lev?: number;
    trades: IObj[];
    platNm: string;
}) => {
    const useFbAdvanced = true
    if (useFbAdvanced) {
        return strFbAdvanced({
            df,
            balance,
            buyCond,
            sellCond,
            pair,
            maker,
            taker,
            trades,
            platNm,
        });
    }

    let pos = false;
    let cnt = 0,
        gain = 0,
        loss = 0,
        buyFees = 0,
        sellFees = 0,
        lastPx = 0;

    let mData: IObj = { data: [] },
        _data: IObj;
    console.log("BEGIN BACKTESTING...\n");
    let entry: number = 0,
        entryLimit: number | null = null,
        exitLimit: number | null = null,
        tp: number | null = null,
        base: number = 0,
        sl: number | null = null,
        exit: number = 0,
        enterTs = "";

    const pricePrecision = getPricePrecision(pair, platNm);
    const minSz = getMinSz(pair, platNm);
    const maxSz = getMaxSz(pair, platNm);
    const maxAmt = getMaxAmt(pair, platNm);
    const basePrecision = getCoinPrecision(pair, "limit", platNm);
    const quote = pair[1]


    console.log({ minSz, maxSz, pricePrecision, basePrecision });
    let START_BAL = balance
    console.log({balance})

    let aside = 0

    const putAside = (amt: number)=>{
        if (!PUT_ASIDE) return
        balance -= amt;
        aside += amt;
        START_BAL = balance;
    }

    let _bool = false
    let buyRow = df[0]
    const _fillSellOrder = (ret: ReturnType<typeof fillSellOrder>) => {
        (pos = ret.pos),
            (mData = ret.mData),
            (sl = ret.sl),
            (tp = ret.tp),
            (entryLimit = ret.entryLimit),
            (cnt = ret.cnt),
            (gain = ret.gain),
            (loss = ret.loss);
        sellFees += ret.fee;
        exitLimit = null;
        entryLimit = null;
        balance += ret.balance
        const profitPerc = (balance - START_BAL) / START_BAL * 100
        if (profitPerc >= 100){
            putAside(balance/2.5)
        }
        _bool = false
    };

    const _fillBuyOrder = (ret: ReturnType<typeof fillBuyOrder>) => {
        if (maxSz == null  || minSz == null  || pricePrecision == null  || basePrecision == null) return
        (pos = ret.pos),
            (mData = ret.mData),
            (_cnt = ret._cnt);
        buyFees += ret.fee;
        tp = toFixed(entry * (1 + TP / 100), pricePrecision!);
        sl = toFixed(entry * (1 - SL / 100), pricePrecision!);
        base += ret.base
    };

    async function _fillSell({_exit, _base, _row, isSl} : {_exit: number, _row: ICandle, _base: number, isSl?: boolean}) {
        console.log("\nSELLING", {_base, _exit} ,"\n")
        if (maxSz == null  || minSz == null  || pricePrecision == null  || basePrecision == null) return

        const _bal = _base * _exit
        if (_bal > maxAmt!){
            console.log(`BAL ${_bal} > MAX_AMT ${maxAmt}`)
             _base = (maxAmt! * (1 - .5/100)) / _exit
             _base = toFixed(_base, basePrecision!)
            return _fillSell({_exit, _base, _row, isSl})

        }
        const ret = fillSellOrder({
            exitLimit,
            exit: _exit,
            prevrow: _row,
            entry: entry,
            base: _base,
            pricePrecision,
            enterTs,
            gain,
            loss,
            cnt,
            mData,
            pos,
            sl,
            tp,
            entryLimit,
            maker,
            isSl,
        });
        

        _fillSellOrder(ret);
        _cnt = 0;
        base -= _base

        console.log(`\nAFTER SELL: bal = ${balance}, base = ${base}\n`);
    }

    function _fillBuy({amt, _entry, _row} : {amt: number, _entry: number, _row: ICandle}) {
        console.log("\BUYING", {amt, _entry} ,"\n")
        if (maxSz == null  || minSz == null  || pricePrecision == null  || basePrecision == null) return
        const _base = amt / _entry;
        if (_base < minSz) {
            const msg =  `BASE: ${_base} < MIN_SZ: ${minSz}`
            return console.log(`${msg}`);
        }else if (_base > maxSz!){
            const msg = `BASE: ${_base} > MAX_SZ: ${maxSz}`;

            console.log(`${msg}\n`);

            amt =( maxSz * (1 - .5/100)) * _entry
            amt = toFixed(amt, pricePrecision)
            return _fillBuy({amt, _entry, _row})
        }
        _cnt = 0;
        if (!entryLimit) entryLimit = entry;
        const ret = fillBuyOrder({
            entry: _entry,
            prevrow: _row,
            entryLimit,
            enterTs,
            taker,
            balance: amt,
            basePrecision,
            mData: { ...mData },
            pos,
        });
        _fillBuyOrder(ret);
        balance -= amt

        console.log(`\nAFTER BUY: bal = ${balance}, base = ${base}\n`);
        buyRow = _row
        
    }

    for (let i = d + 1; i < df.length; i++) {
        
        
        const prevrow = df[i - 1],
            row = df[i];

 if (maxSz == null  || minSz == null  || pricePrecision == null  || basePrecision == null || row.v <= 0
            // || maxReached //|| profitPerc >= 100//9900
            ) continue;
        lastPx = row.o;

        const isGreen = prevrow.c >= prevrow.o
        const isYello = prevrow.c > row.o
        console.log(`\nTS: ${row.ts}`);
        console.log({ts: row.ts, o: row.o, h: row.h, l: row.l, c: row.c, v: row.v})

        if (pos) _cnt += 1;

        const isSom = prevrow.c > row.o;

        if (!pos && buyCond(prevrow, df, i)) {
            console.log("\nKAYA RA BUY\n");
            // Place limit buy order
            entryLimit = row.o;
            enterTs = row.ts;
            console.log(
                `[ ${row.ts} ] \t MARKET buy order at ${entryLimit?.toFixed(
                    pricePrecision
                )}`
            );
            if (entryLimit && isMarket) {
                entry = row.o;
                console.log({vol: row.v})
                _fillBuy({amt: balance, _entry: entry, _row: row});
                //continue;
            }

          //  if (isGreen) continue
        }
  

        if (pos) {
            console.log("\nKAYA RA SELL");
            const _row = row;
            const { o, h, l, c } = _row;

            let SL = .5, isSl = false;
            

            const TRAIL = .25;
            const trail = h * (1 - TRAIL / 100),
                prev_trail = prevrow.h * (1 - TRAIL / 100);
            //exit = tp;
            const TP = 3.5
            tp = ceil(o * (1 + TP / 100), pricePrecision);
            let _base = base

            
            if (false) {
            } else if (exitLimit && o >= prev_trail && isSom || o > prevrow.h) {
                exit = o;
                SL *= 1.5//2.5;
            } 
            else {
                exit = tp
            }
            // else if (trail >= tp) {
            //     exit = WCS1 ? tp : trail;
            // }
            if (!isGreen && !isSom) exitLimit = c;
            else {
                exitLimit = null;
            }

            sl = ceil(entry * (1 - SL / 100), pricePrecision);
            
            console.log({o, h, l, c, vol: row.v, tp,sl, _base, isGreen})
            if (exit != 0 && exit <= h && exit >= sl) {
                isSl = exit < entry;
                console.log({vol: row.v})
                _fillSell({_base, _exit: exit, _row, isSl});
            }
        }
    }

    const oKeys = Object.keys(mData.data);
    const lastPos = mData.data[oKeys[oKeys.length - 1]];

    if (lastPos && lastPos.side.startsWith("buy")) {
        console.log("ENDED WITH BUY");
        const _row = SELL_AT_LAST_BUY ? buyRow : df[df.length - 1]
        const _exit = SELL_AT_LAST_BUY ? lastPos._c : _row.o;
        _fillSell({_row, _exit, _base: base, isSl: true})
       
    }

    console.log('\n', {balance, aside, base});

    
    gain = Number(((gain / cnt) * 100).toFixed(2));
    loss = Number(((loss / cnt) * 100).toFixed(2));
    _data = { ...mData, balance, trades: cnt, gain, loss, aside};

    console.log(`\nBUY_FEES: ${quote} ${buyFees}`);
    console.log({ minSz, maxSz, maxAmt });
    
    console.log(`SELL_FEES: ${quote} ${sellFees}\n`);
    
    return _data;
};
