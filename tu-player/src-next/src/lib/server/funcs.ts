"use server"
import { stat, statSync } from "fs"

export const getFileSz = async (f: string) => {
    const _stat = statSync(f)
    return _stat.size
}