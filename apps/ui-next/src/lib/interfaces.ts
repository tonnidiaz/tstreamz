import { NextRequest } from "next/server";
import { useTuState0 } from "./hooks";

export type TuState<T> = ReturnType<typeof useTuState0<T>>;
export type TuApiHandler = (req?: Request | NextRequest, sec? : {params: Promise<{[key: string] : string}>}) => Response | Promise<Response>;
