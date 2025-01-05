import { TestBinance } from "@pkg/cmn/classes/test-binance";
import { TestBitget } from "@pkg/cmn/classes/test-bitget";
import { TestKucoin } from "@pkg/cmn/classes/test-kucoin";
import { TestMexc } from "@pkg/cmn/classes/test-mexc";
import { TestPlatform, TestBybit, TestOKX } from "@pkg/cmn/classes/test-platforms";
// import { parentStrategies } from "@pkg/cmn/strategies";


export const test_platforms : {[key: string] : typeof TestPlatform} = {
    binance: TestBinance ,
    bybit: TestBybit ,
    okx: TestOKX ,
    kucoin: TestKucoin ,
    bitget: TestBitget,
    mexc: TestMexc,
};

export const _plats = Object.keys(test_platforms)