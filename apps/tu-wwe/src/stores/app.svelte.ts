import type { IObj } from "@cmn/utils/interfaces";

export const appStore = $state({
    ready: false,
    maxVidsPerPage: 15,
    totalVids: {raw: 0, smackdown: 0, all: 0}
});

type T = typeof appStore;

export const setReady = (v: typeof appStore.ready) =>
    (appStore.ready = v);

export function updateAppStoreField<K extends keyof T>(key: K, value: T[K]): void {
    appStore[key] = value
  }

