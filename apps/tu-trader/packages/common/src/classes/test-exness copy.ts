import { env } from "process";
import { TestPlatform } from "./test-platforms";
import MetaApi, { MetatraderCandle, type MetatraderAccount } from "metaapi.cloud-sdk";
import { handleErrs, parseDate } from "@cmn/utils/funcs";
import { ensureDirExists, writeJson } from "@cmn/utils/bend/funcs";
import { writeFileSync } from "fs";
import { getInterval, parseKlines } from "../utils/funcs2";
import { DEV } from "../utils/constants";
export class TestExness extends TestPlatform {
    apiKey: string;
    accId: string;
    account: MetatraderAccount | undefined;
    metaApi: MetaApi;

    constructor({ demo = false }: { demo?: boolean }) {
        super({ demo, name: "exness" });
        this.apiKey = demo ? env.METAAPI_KEY_DEMO : env.METAAPI_KEY;
        this.accId = demo ? env.METAAPI_ACC_ID_DEMO : env.METAAPI_ACC_ID;
        // if (DEV) console.log({apiKey: this.apiKey});
        this.metaApi = new MetaApi(this.apiKey);

    }

    async init() {
        
        this.account = this.account || await this.metaApi.metatraderAccountApi.getAccount(
            this.accId
        );
        
        this.log({accState: this.account.state});
    }

    async getKlines({
        start,
        end,
        savePath,
        interval,
        symbol,
        limit: _limit
    }: {
        end?: number;
        start?: number;
        limit?: number;
        interval: number;
        symbol: string;
        savePath?: string;
    }): Promise<any[] | undefined> {
        await this.init()
        await super.getKlines({ start, end, savePath, interval, symbol });
        try {

            // start = Date.parse("2025-01-05 00:00:00+02:00")
            // const limit = _limit || 1000
            const _interval = getInterval(interval, "exness")
            // const day = new Date(start).getDay()
            // this.log({day})
            // if (day > 5){
            //     start += 
            // }
            // const res = await this.account.getHistoricalCandles(symbol, _interval, new Date(start), limit)
            // const first = parseDate(res[0].time)
            // const last = parseDate(res[res.length - 1].time)
            // console.log({first, last});
            // return []
            end = end ?? Date.now();
            let klines: number[][] = [];
            let cnt = 0;

            if (start) {
                start =
                    start -
                    20 * interval * 60000; /* ACCORDING TO RETURNED DATA */
            }

            let firstTs = start;
            const limit = _limit || 1000;
            while (firstTs <= end) {
                
                this.log(`GETTING ${cnt + 1} KLINES LIMIT: ${limit}`);
                const after = firstTs + (limit) * interval * 60 * 1000;
                this.log(
                    `Before: ${parseDate(
                        new Date(firstTs)
                    )} \t After: ${parseDate(new Date(after))}`
                );
                this.log("GETTING MARK PRICE", {firstTs});
                const res = await this.account.getHistoricalCandles(
                    symbol,
                    _interval,
                    new Date(after),
                    limit
                );
                let data = res.map((el) => [
                    Date.parse(el.time.toISOString()),
                    el.open,
                    el.high,
                    el.low,
                    el.low,
                    el.close,
                    el.volume,
                ]);

                if (!data?.length) break;
              
                if (klines.length)
                      data = data.filter(el=> el[0] > klines[klines.length - 1][0])
                klines.push(...data);
                const firstKline = res[0].time
                const lastKline = [...res].pop().time
                parseKlines
                console.log({len: klines.length});
                this.log({firstKline, lastKline})
                
                firstTs = [...klines].pop()[0];
                this.log({
                    last_kline: parseDate(Number(klines[klines.length - 1][0])
                    ),
                    first_ts: parseDate(new Date(firstTs)),
                });
                firstTs -= interval * 60000
                if (savePath) {
                    ensureDirExists(savePath);
                    writeFileSync(savePath, JSON.stringify(klines));
                    this.log("Saved");
                }
                // if (cnt >= 3) break
                cnt += 1;
            }

            let d = [...klines];
            this.log(d[d.length - 1]);
            return d;
        } catch (err) {
            this.log("Failed to get klines");
            handleErrs(err);
        }
    }
}

