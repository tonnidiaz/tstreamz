export const appStore = $state({
    ready: false,
    maxVidsPerPage: 10
});

type T = typeof appStore;

export const setReady = (v: typeof appStore.ready) =>
    (appStore.ready = v);

export function updateAppStoreField<K extends keyof T>(key: K, value: T[K]): void {
    appStore[key] = value
  }

