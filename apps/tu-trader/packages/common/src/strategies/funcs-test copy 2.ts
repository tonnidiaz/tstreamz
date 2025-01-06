import {
    MAKER_FEE_RATE,
    TAKER_FEE_RATE,
    useSwindLow,
} from "@pkg/cmn/utils/constants";

import {  ICandle } from "@pkg/cmn/utils/interfaces";
import { DefTester } from "./def";
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

    const defTester = new DefTester({
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
    })
   return defTester.run()
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