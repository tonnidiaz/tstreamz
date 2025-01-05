import { parentStrategies } from "@cmn/strategies";
import { MAKER_FEE_RATE, TAKER_FEE_RATE } from "@cmn/utils/constants";
import { IObj, ICandle } from "@cmn/utils/interfaces";

export class Strategy {
    name: string;
    desc: string = "";

    constructor() {
        this.name = this.constructor.name
    }
    buyCond(row: ICandle): boolean {
        return false;
    }
    sellCond(
        row: ICandle,
        entry?: number,
        df?: ICandle[],
        i?: number
    ): boolean {
        return false;
    }
    run({
        df,
        balance,
        lev = 1,
        pair,
        maker = MAKER_FEE_RATE,
        taker = TAKER_FEE_RATE,
        platNm,
        trades,
        parent,
    }: {
        df: ICandle[];
        trades: IObj[];
        balance: number;
        lev?: number;
        pGain?: number;
        maker: number;
        taker: number;
        pair: string[];
        platNm: string;
        parent: string;
    }) {
        console.log(
            `\nRunning ${this.name} strategy [${this.desc}] \t ${pair}\n`
        );
        // const mData = strategy({
        //     df,
        //     balance,
        //     buyCond: this.buyCond,
        //     sellCond: this.sellCond,
        //     pair,
        //     lev,
        //     maker,
        //     taker,
        //     trades,
        //     platNm,
        // });

        const params = {
            df,
            balance,
            buyCond: this.buyCond,
            sellCond: this.sellCond,
            pair,
            lev,
            maker,
            taker,
            trades,
            platNm,
        };

        const Fn = new parentStrategies[parent](params);

        const mData = Fn.run();
        return mData;
    }

    toJson() {
        let o = {};
        for (let k of Object.keys(this)) {
            o[k] = this[k];
        }
        return o;
    }
}


export type TBuyCond = typeof Strategy.prototype.buyCond
export type TSellCond = typeof Strategy.prototype.sellCond