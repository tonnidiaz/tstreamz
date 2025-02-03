import { V2 } from "paseto";
(async () => {
    const key = await V2.generateKey("public");
    const token = await V2.sign({ userId: 123 }, key);
    console.log(token);
})();
