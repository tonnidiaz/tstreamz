import { IBot } from "@pkg/cmn/models/bot";
import { getSymbol } from "@pkg/cmn/utils/functions";
import { botLog} from "@pkg/cmn/utils/bend/functions";
import { IOrderDetails, IOrderbook } from "@pkg/cmn/utils/interfaces";
import { handleErrs, randomInRange, sleep } from "@cmn/utils/funcs";
import { MAKER_FEE_RATE } from "@pkg/cmn/utils/constants";

export class Platform {
    name: string;
    bot: IBot;
    pair: string[]
    constructor(bot: IBot, pair?: string[]) {
        this.name = this.constructor.name;
        this.bot = bot;
        this.pair = pair || [bot.base, bot.ccy]
        this.log(`INIT, MODE = ${bot.demo ? "demo" : "live"}`);
    }
    async getOrderbook(symbol?: string) : Promise<IOrderbook | void | undefined | null> {
        symbol = symbol ?? this.getSymbol();
        this.log( `[${this.name}] GETTING ORDERBOOK FOR ${symbol}...`)
    }
    async getKlines({
        start,
        end,
        interval,
        pair,
        limit,
    }: {
        end?: number;
        start?: number;
        interval?: number;
        pair?: string[];
        limit?: number;
    }): Promise<any[][] | undefined | null | void> {
        pair = pair ?? this._getPair();
        const symbol = getSymbol(pair, this.bot.platform);

        this.log( `GETTING KLINES FOR ${symbol}...`);
    }

    _getPair() {
        return this.pair;
    }
    getSymbol() {
        return getSymbol(this._getPair(), this.bot.platform);
    }

    async cancelOrder({
        ordId,
        isAlgo,
    }: {
        ordId: string;
        isAlgo?: boolean;
    }): Promise<string | undefined | null | void> {
        this.log( `CANCELLING ORDER ${ordId}...`);
    }

    async placeOrder({amt, price, side = "buy", sl, clOrderId, useBaseCcy}:
        {amt: number,
        price?: number,
        side?: "buy" | "sell" ,
        sl?: number,
        clOrderId?: string,
        useBaseCcy?: boolean}
    ): Promise<string | void | undefined | null> {
        const od = { price, sl, amt, side, useBaseCcy };
        this.log( `PLACING ORDER FOR [${this.pair}]`), { od };
    }

    async getOrderbyId(
        orderId: string,
        isAlgo = false,
        pair?: string[]
    ): Promise<IOrderDetails | null | "live" | undefined | void> {
        this.log( `GETTING ORDER ${orderId}...`);
    }

    async getBal(ccy?: string): Promise<number | void | undefined | null> {
        this.log( `GETTING BALANCE...`);
    }
    async withdraw({amt, coin, chain, addr, memo}: {amt: number; coin: string; chain: string; addr: string; memo?: string}) : Promise<string | null | void | undefined>{
        this.log( `WITHDRAWING ${coin} through ${chain}`);
    }

    log(...args: any[] ){
        botLog(this.bot, `[${this.name}]: [${this.pair}]`, ...args)
    }
    /**
     * 
     * @param sz is the base
     * @param cTime is the order creation time
     * @returns dummy order details
     */
    async getDummyOrder({orderId, side, symbol, sz, cTime} : {orderId: string, side: "buy" | "sell", symbol: string, sz: number, cTime: number}){
        this.log(`[${symbol}] Getting dummy order [${orderId}]...`)
        try {
            await sleep(randomInRange(1000, 2000))
            const orderBook = await this.getOrderbook(symbol)
            if (!orderBook) return this.log(`[${symbol}] Dummy: Failed to get orderbook`)
            const px = (side == "buy" ? orderBook.asks : orderBook.bids)[0].px
            
            // Because we use the quote amount to place buy orders
            if (side == "buy") sz = sz / px;

            let res: IOrderDetails = {id: orderId, fillPx: px, fillSz: sz, fee: sz * MAKER_FEE_RATE, fillTime: Date.now(), cTime }
            return res
        } catch (err) {
            this.log(`Could not get dummy order [${orderId}]`)
            handleErrs(err)
        }
    }
}
