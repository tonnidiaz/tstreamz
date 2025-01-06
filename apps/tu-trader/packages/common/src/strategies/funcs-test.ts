import {
    MAKER_FEE_RATE,
    TAKER_FEE_RATE,
    useSwindLow,
} from "@pkg/cmn/utils/constants";


import { ICandle } from "@pkg/cmn/utils/interfaces";
import { strategy as strNoClass } from "./funcs-test-no-class";
import { DefTester } from "./def";
import { DefTester60 } from "./def-60";
import { Backtest } from "./class";
import { IObj } from "@cmn/utils/interfaces";

let _cnt = 0;

const d = useSwindLow ? 20 : 0;
export const strategy = ({
    df,
    balance,
    buyCond,
    sellCond,
    lev = 1,
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
    platNm: string
}) => {

    const params = {
        df,
        balance,
        buyCond,
        sellCond,
        lev,
        pair,
        maker,
        taker,
        trades,
        platNm,
    }

    const useNoClass = false,
    useDef5 = false;

    

    let Fn: typeof Backtest, res: ReturnType<typeof strNoClass>;
    if (useNoClass){
        res = strNoClass(params)
    }else {
        if (useDef5){
            Fn = DefTester
        }else{
            Fn = DefTester60
        }

        res = new Fn(params).run()
}
   return res
};


/* 

{
    df,
    balance,
    buyCond,
    sellCond,
    lev = 1,
    pair,
    maker = MAKER_FEE_RATE,
    taker = TAKER_FEE_RATE,
    trades,
    platNm,
}

*/