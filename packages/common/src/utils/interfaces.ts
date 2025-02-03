
export interface IObj {
    [key: string]: any;
}

export interface ITask {name: string, id: string; interval: number; cb: (id: string)=> Promise<any>; active: boolean; desc?: string}

type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}.${P}`
        : never
    : never;

type Leaves<T> = T extends object
    ? {
          [K in keyof T]-?: K extends string | number
              ? T[K] extends object
                  ? Join<K, Leaves<T[K]>> | K
                  : K
              : never;
      }[keyof T]
    : never;

export type Path<T> = Leaves<T>;