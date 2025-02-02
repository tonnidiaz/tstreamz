import { NextRequest } from "next/server";
import { useTuState } from "./hooks";

export type TuState<T> = ReturnType<typeof useTuState<T>>;
export type TuApiHandler = (req?: Request | NextRequest, sec? : {params: Promise<{[key: string] : string}>}) => Response | Promise<Response>;
