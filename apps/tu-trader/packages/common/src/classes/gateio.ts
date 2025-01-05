import { IBot } from "@cmn/models/bot";
import { DEV } from "@cmn/utils/constants";
import { getInterval, parseFilledOrder } from "@cmn/utils/funcs2";
import { parseDate, getSymbol } from "@cmn/utils/functions";
import { botLog } from "@cmn/utils/bend/functions";
import { IOrderDetails } from "@cmn/utils/interfaces";
import { SpotApi, ApiClient, Trade, Order } from "gate-api";
import { Platform } from "./platforms";

export class Gateio extends Platform {
    name = "GATEIO";
    maker: number = 0.2 / 100;
    taker: number = 0.2 / 100;
    client: SpotApi;
    apiKey: string;
    apiSecret: string;
    tradeApi: Trade;

    constructor(bot: IBot, pair?: string[]) {
        super(bot, pair);
        this.apiKey = process.env.GATEIO_API_KEY!;
        this.apiSecret = process.env.GATEIO_API_SECRET!;

        const client = new ApiClient();
        this.client = new SpotApi(client);
        this.tradeApi = new Trade();
    }

    _parseData(data: (number | string)[][]) {
        /**
                 *  0 - Unix timestamp with second precision
                    1 - Trading volume in quote currency
                    2 - Closing price
                    3 - Highest price
                    4 - Lowest price
                    5 - Opening price
                    6 - Trading volume in base currency
                    7 - Whether the window is closed; tr
                 */
        return data
            .map((el) => {
                return el.map((el, i) => (i == 0 ? Number(el) * 1000 : el));
            })
            .map((el) => [el[0], el[5], el[3], el[4], el[2], el[1], el[7]]);
    }

    async getKlines({
        start,
        end,
        savePath,
        interval,
        symbol,
        isBybit,
    }: {
        end?: number | undefined;
        start?: number | undefined;
        interval: number;
        symbol: string;
        savePath?: string | undefined;
        isBybit?: boolean;
    }) {
        end = end ?? Date.now() - interval * 60000;

        const END = end;
        const diff = (10000 - 30) * interval * 60000;
        const MIN_DATE = end - diff;

        console.log({
            MIN_DATE: parseDate(new Date(MIN_DATE)),
            START: parseDate(new Date(start ?? 0)),
        });
        if (start && start < MIN_DATE) {
            //start = MIN_DATE;
            //end = start + diff
        }
        if (end && end > Date.now()) {
            end = Date.now();
        }

        let klines: any[] = [];
        let cnt = 0;
        console.log(`GETTING KLINES.. FOR ` + symbol);

        if (start) {
            start =
                (isBybit ? start : start) /* - interval * 60 * 1000 */ -
                20 * interval * 60000; /* ACCORDING TO RETURNED DATA */
        }

        const res = await this.client.listCandlesticks(
            symbol,

            {
                interval: getInterval(interval, "gateio"),
                from: start ? Math.round(start / 1000) : undefined,
                to: end ? Math.round(end / 1000) : undefined,
            }
        );

        const data = this._parseData(res.body);
        klines = [...data];

        let d = [...klines];
        console.log(d[d.length - 1]);
        return d;
    }

    async placeOrder({ amt, price, side, sl, clOrderId, useBaseCcy }: { amt: number; price?: number; side?: "buy" | "sell"; sl?: number; clOrderId?: string; useBaseCcy: boolean; }): Promise<string | void | undefined | null> {

        await super.placeOrder({amt, price, side, sl, clOrderId, useBaseCcy});
        const pair = [this.bot.base, this.bot.ccy]
        const ordType = price == undefined ? 'market' : 'limit'
        try {
          
          const  res = await this.client.createOrder({
                currencyPair: getSymbol(pair, this.bot.platform),
                type:  ordType as any,
                side: side as any,
                amount: amt.toString(),
                price: price?.toString(),
            });

            if (res.response.status != 201) {
                console.log(res);
                return;
            }
            console.log(`\ORDER PLACED FOR BOT=${this.bot.name}\n`);

            return res.body.id!;
        } catch (error) {
            console.log(error);
        }
    }

    async getOrderbyId(orderId: string, isAlgo = false) {
        try {
            let data: IOrderDetails | null = null;

            botLog(this.bot, "GETTING ORDER...");
            const res = await this.client.getOrder(orderId, getSymbol([this.bot.base, this.bot.ccy], this.bot.platform), {});

            if (res.response.status != 200) {
                console.log(res);
                return;
            }
            
            const d = res.body;

            if (DEV) console.log(d);
            if (d.status != Order.Status.Closed) {
                
                botLog(this.bot, "Order not yet filled", {status: d.status});
                return "live";
            }

            data = parseFilledOrder(d, this.bot.platform);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}
