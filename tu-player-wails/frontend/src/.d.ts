import { IStaticMethods } from "preline/preline";

export {}
declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
        cv: any;
    }
}