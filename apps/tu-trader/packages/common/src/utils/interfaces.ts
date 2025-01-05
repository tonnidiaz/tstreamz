
import { ObjectId } from "mongoose";
import { Socket } from "socket.io";
import { platList, logTypes, arbitTypes } from "./consts3";
import { CrossArbitData } from "@pkg/cmn/classes/tu";
import { IBot } from "@pkg/cmn/models/bot";
import { IObj } from "@cmn/utils/interfaces";


export interface IRetData {
    ep: string;
    clId: string;
    data: IObj;
    [key: string]: any;
}
export interface ICandle {
    ts: string;
    o: number;
    h: number;
    l: number;
    c: number;
    ha_o: number;
    ha_h: number;
    ha_l: number;
    ha_c: number;
    [key: string]: number | any;
}
export interface IAddress {
    place_name: string;
    center: [number];
    street: string;
    suburb: string;
    city: string;
    line2: string;
    state: string;
    postcode: number;
    phone: string;
    name: string;
}

export interface ITrade {
    ts: string;
    symbol: string;
    px: number;
    sz: number;
}

export interface IOrderDetails {
    id: string;
    fillTime: number;
    cTime: number;
    fillSz: number;
    fillPx: number;
    fee: number;
}

export interface IOpenBot {
    id: ObjectId;
    exitLimit: number;
    klines: any[][];
}

export interface IPlat {
    name: string;
    base: number;
    quote: number;
    df: ICandle[];
    med?: number;
    medDf?: ICandle[];
}

export interface ICcy {
    ccy: string;
    chain: string;
    maxFee: number;
    minFee: number;
    minDep: number;
    minWd: number;
    maxWd: number;
}

export interface IBook {
    px: number;
    amt: number;
    cnt?: number;
}
export interface IOrderbook {
    ts: string;
    bids: IBook[];
    asks: IBook[];
}

export interface IOrderpage {
    ask: IBook;
    bid: IBook;
}

interface IArbitBot {
    bot: IBot;
    active: boolean;
    client?: Socket;
    demo?: boolean;
}
export interface ITriArbitBot extends IArbitBot {
    pairA: string[];
    pairB: string[];
    pairC: string[];
    bookA?: IOrderpage;
    bookB?: IOrderpage;
    bookC?: IOrderpage;
    tickerA?: number;
    tickerB?: number;
    tickerC?: number;
}

export interface ICrossArbitBot extends IArbitBot {
    pair: string[];
    data: CrossArbitData;
    client?: Socket;
}

export type TPlatName = (typeof platList)[number];
export type TArbitType = (typeof arbitTypes)[number];
export type TLogType = (typeof logTypes)[number];
export interface ILog {log: string | Uint8Array; type: TLogType; ts: string}
export interface ICoinNets {
    name: string;
    coin: string;
    ticker?: number;

    nets: {
        coin: string;
        name: string;
        contractAddr: string;
        chain: string;
        wdTip?: string | null;
        dpTip?: string | null;
        minWd: number;
        wdFee: number;
        wdFeeUSDT: number;
        maxWd: number;
        minDp: number;
        maxDp: number;
        minComfirm: number;
        canDep: boolean;
        canWd: boolean;
    }[];
}


export interface ITask {id: string; interval: number; cb: (id: string)=> any; active: boolean}