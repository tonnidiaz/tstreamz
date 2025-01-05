import { Server } from "socket.io";
import { CorsOptions } from "cors";
import { IRetData } from "./interfaces";
import { tuCE, heikinAshi, parseKlines, tuPath } from "./funcs2";
import { klinesDir, klinesRootDir, tradesRootDir, useLimitTri } from "./constants";
import { existsSync } from "node:fs";
import {
    getSymbol,
} from "./functions";
import { objStrategies, parentStrategies, strategies } from "@pkg/cmn/strategies";
import { TestOKX } from "@pkg/cmn/classes/test-platforms";
import { test_platforms } from "./consts";
import { onArbitCointest, onBacktest, onCointest } from "./functions/io-funcs";
import { onCompArbitCointest } from "./functions/io-funcs5";
import { onCrossArbitCointest } from "./functions/io-funcs3";
import { onCrossCompareArbitCointest } from "./functions/io-funcs4";
import { CrossArbitData } from "@pkg/cmn/classes/tu";
import { Bot } from "@pkg/cmn/models";
import { crossArbitWsList, triArbitWsList } from "@pkg/cmn/classes/tu-ws";
import { readJson } from "./bend/functions";
import { onTriArbitCointestLimit } from "./functions/io-funcs2-limit";
import { onTriArbitCointest } from "./functions/io-funcs2";
import { onTriArbitCointestGrids } from "./functions/io-funcs2-grids";
import { clearTerminal, parseDate } from "@cmn/utils/funcs";
import { IObj } from "@cmn/utils/interfaces";
const corsOptions: CorsOptions = { origin: "*" };
const io = new Server({ cors: corsOptions }); // yes, no server arg here; it's not required
let prevData: IRetData | undefined | null;
// attach stuff to io
io.on("connection", (client) => {
    console.log(`IO: ${client.id} CONNECTED`);

    console.log({ ep: prevData?.ep });
    if (prevData && prevData.ep) {
        io.emit(prevData.ep, prevData);
        //prevData = null
    }
    io.emit("event", "This is event");
    client.on("event", (d) => {
        console.log(d);
    });
    client.on("comment", (data) => {
        console.log("RETURNING THE COMMENT..");

        io.emit("comment", data);
    });
    client.on("rf", (d) => {
        console.log("RF:", d);
        setTimeout(() => {
            console.log("RETURNING THE FAVOUR..");
            io.emit("rf", "I got you dawg");
        }, 1500);
    });

    client.on(
        "backtest",
        async (d) => (prevData = await onBacktest(d, client))
    );
    client.on(
        "cointest",
        async (d) => (prevData = await onCointest(d, client))
    );
    client.on(
        "arbit-cointest",
        async (d) => {
            const ep = "arbit-cointest"
            const fn = onTriArbitCointest//useLimitTri ? onTriArbitCointestLimit : onTriArbitCointest
            prevData = await fn({...d, ep}, client)
        }
    );
    client.on(
        "comp-arbit-cointest",
        async (d) => (prevData = await onCompArbitCointest(d, client))
    );
    client.on(
        "cross-arbit-cointest",
        async (d) => (prevData = await onCrossArbitCointest(d, client))
    );
    client.on(
        "cross-compare-arbit-cointest",
        async (d) => (prevData = await onCrossCompareArbitCointest(d, client))
    );

    client.on("strategies", (e) => {
        client.emit("strategies", { data: strategies });
    });
    client.on("platforms", (e) => {
        client.emit("platforms", { data: Object.keys(test_platforms) });
    });
    client.on("parents", (e) => {
        client.emit("parents", { data: Object.keys(parentStrategies) });
    });

    client.on("/client-ws/kill", async (fd) => {
        console.log("KILLING BOT...");
        const list = [...Object.values(triArbitWsList), ...Object.values(crossArbitWsList)]
        for (let ws of list) {
            await ws.kill();
        }
      
        console.log("KILLED");
        client?.emit("/client-ws/kill", 'killed')
    });
    client.on("/client-ws/add-bot", async (fd) => {
        try {
            console.log("NEW CLIENT BOT");
            const { A, B, C, platform, type, platA, platB, pair } = fd;
            const demo = true
            let id = `bot-${Date.now()}`;
            if (type == "tri") {
                const bot = new Bot({
                    name: `TRI-${id}`,
                    platform,
                    A,
                    B,
                    C,
                    arbit_settings: { _type: "tri" },
                });
                id = `${bot.id}`;
                await triArbitWsList[platform].addBot(bot, client, demo);
            } else {
                console.log({platA, platB, pair})
                const bot = new Bot({
                    name: `CROSS-${id}`,
                    platA,
                    platB,
                    
                    base: pair[0], ccy: pair[1],
                    arbit_settings: { _type: "cross" },
                });
                id = `${bot.id}`;
                const data = new CrossArbitData();
                data.pair = pair
                data.platA = platA; data.platB = platB
                await crossArbitWsList[platA].addBot(bot, client, demo ,data);
                await crossArbitWsList[platB].addBot(bot, client, demo, data);
            }
            console.log("CREATED");
            client.emit("/client-ws/add-bot", id);
        } catch (e) {
            console.log(e);
        }
    });

    client.on("test-candles", async (data: IObj) => {
        clearTerminal();
        try {
            const pair = data.symbol;
            let {
                interval,
                start,
                end,
                offline,
                platform,
                isHa,
                useFile,
                file,
                save,
                isParsed,
                demo,
            } = data;

            const startTs = Date.parse(start),
                endTs = Date.parse(end);

            let klinesPath: string | null;
            let klines: any[] = [];

            client.emit("test-candles", "Getting klines...");

            const plat = new test_platforms[platform]({ demo });
            const platName = platform.toLowerCase();
            const symbol = getSymbol(pair, platName);
            console.log(symbol);
            const test = false;
            if (useFile && !file) {
                client.emit("test-candles", { err: "File required" });
                return;
            }
            start = start ?? parseDate(new Date());
            const year = start.split("-")[0];
            const sub = demo ? "demo" : "live";
            klinesPath = tuPath(
                `${klinesRootDir}/${platName.toLowerCase()}/${year}/${sub}/${symbol}_${interval}m-${sub}.json`
            );

            if (offline && !useFile) {
                console.log("IS OFFLINE");

                if (!existsSync(klinesPath!)) {
                    const err = {
                        err: `${klinesPath} does not exist`,
                    };
                    client.emit("test-candles", err);
                    return;
                }
            } else if (!offline && !useFile) {
                //const bot = new Bot({name:"Temp", base: baseCcy[0], ccy: baseCcy[1]})
                //const bybit = new Bybit(bot)
                const r = await plat.getKlines({
                    start: startTs,
                    end: endTs,
                    interval,
                    symbol,
                    savePath: save ? klinesPath : undefined,
                });
                if (!r) {
                    client.emit("err", "Failed to get klines");
                    return;
                }
                klines = r;
            }
            if (offline && !useFile)
                console.log(`\nKLINES_PATH: ${klinesPath!}\n`);
            if (useFile) console.log(`\nUse file\n`);

            client.emit("test-candles", "Analyzing data...");
            klines =
                useFile && file
                    ? JSON.parse(file.toString("utf-8"))
                    : offline
                    ? readJson(klinesPath!)
                    : klines;
            klines = parseKlines(klines);

            let df = tuCE(heikinAshi(klines));
            if (offline && !useFile) {
                // Return oly df from startTs to endTs
                df = test
                    ? df
                    : df.filter(
                          (el) =>
                              Date.parse(el.ts) <= endTs &&
                              Date.parse(el.ts) >= startTs
                      );
            }
            const retData = df.map((el, i) => {
                const ts = el.ts;
                return {
                    ts: ts,
                    sma_20: el.sma_20,
                    sma_50: el.sma_50,
                    std: {
                        o: el.o,
                        h: el.h,
                        l: el.l,
                        c: el.c,
                        sma_20: el.sma_20,
                        sma_50: el.sma_50,
                        vol: el.v,
                    },
                    ha: {
                        o: el.ha_o,
                        h: el.ha_h,
                        l: el.ha_l,
                        c: el.ha_c,
                        vol: el.v,
                    },
                };
            });
            client.emit("test-candles", {
                data: retData,
                symbol: pair,
                interval,
            });
            return retData;
        } catch (e: any) {
            console.log(e.response?.data ?? e);
            client.emit("test-candles", { err: "Something went wrong" });
        }
    });
});

export default io;
